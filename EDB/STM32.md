# STM32（裸机开发为主）

本文聚焦 **STM32 裸机（寄存器级）开发**：
- 尽量不使用 HAL / LL / Arduino 等封装库。
- 通过 `RM`（Reference Manual）+ `DS`（Datasheet）直接控制外设。
- 目标是掌握“时钟 → GPIO → 中断 → 定时器 → 串口”这条最核心链路。

---

## 1. 为什么优先学裸机

1. 能看懂芯片启动与外设工作的本质。
2. 出故障时可直接定位到寄存器位，不被库函数“黑盒”困住。
3. 后续再用 HAL 时，你会知道每一行配置到底做了什么。

> 建议：先裸机打底，再把 HAL 当效率工具。

---

## 2. 项目组织建议（裸机）

推荐最小目录：

```txt
project/
  ├─ startup_stm32xxx.s      # 启动文件/中断向量
  ├─ system_stm32xxx.c       # 时钟初始化（可自己精简）
  ├─ linker.ld               # 链接脚本
  ├─ main.c
  ├─ inc/
  │   ├─ stm32_reg.h         # 你自己的寄存器定义（或CMSIS核心头）
  │   └─ board.h
  └─ src/
      ├─ gpio.c
      ├─ usart.c
      ├─ timer.c
      └─ delay.c
```

### 编码原则

- 模块化：GPIO / USART / TIMER 分文件。
- 一次只做一件事：先点灯，再串口，再中断。
- 每个配置步骤都注释“对应 RM 哪一章哪一位”。

---

## 3. 裸机最小闭环：点亮 LED（以 STM32F103 为例）

> 目标：不依赖 HAL，直接操作 RCC + GPIO。

```c
#include <stdint.h>

#define RCC_BASE        0x40021000U
#define GPIOC_BASE      0x40011000U

#define RCC_APB2ENR     (*(volatile uint32_t*)(RCC_BASE + 0x18U))
#define GPIOC_CRH       (*(volatile uint32_t*)(GPIOC_BASE + 0x04U))
#define GPIOC_ODR       (*(volatile uint32_t*)(GPIOC_BASE + 0x0CU))

int main(void)
{
    /* 1) 开启 GPIOC 时钟：RCC_APB2ENR[4] IOPCEN = 1 */
    RCC_APB2ENR |= (1U << 4);

    /* 2) 配置 PC13 为推挽输出 2MHz
       PC13 对应 CRH 的 bit[23:20]
       MODE13 = 10 (2MHz), CNF13 = 00 (GP Push-Pull) */
    GPIOC_CRH &= ~(0xFU << 20);
    GPIOC_CRH |=  (0x2U << 20);

    while (1)
    {
        /* 板载 LED 常见低电平点亮（视板子而定） */
        GPIOC_ODR ^= (1U << 13);
        for (volatile uint32_t i = 0; i < 500000; i++);
    }
}
```

---

## 4. 裸机串口发送（USART1）

核心步骤：
1. 开 GPIOA / USART1 时钟。
2. 配 PA9(TX) 复用推挽，PA10(RX) 浮空输入。
3. 配 BRR 波特率。
4. 开 `UE/TE/RE`。

```c
#define GPIOA_BASE      0x40010800U
#define USART1_BASE     0x40013800U

#define RCC_APB2ENR     (*(volatile uint32_t*)(RCC_BASE + 0x18U))
#define GPIOA_CRH       (*(volatile uint32_t*)(GPIOA_BASE + 0x04U))
#define USART1_SR       (*(volatile uint32_t*)(USART1_BASE + 0x00U))
#define USART1_DR       (*(volatile uint32_t*)(USART1_BASE + 0x04U))
#define USART1_BRR      (*(volatile uint32_t*)(USART1_BASE + 0x08U))
#define USART1_CR1      (*(volatile uint32_t*)(USART1_BASE + 0x0CU))

static void usart1_init(void)
{
    /* GPIOAEN=1, USART1EN=1 */
    RCC_APB2ENR |= (1U << 2) | (1U << 14);

    /* PA9: AF PP 50MHz => 1011, PA10: floating input => 0100 */
    GPIOA_CRH &= ~((0xFU << 4) | (0xFU << 8));
    GPIOA_CRH |=  ((0xBU << 4) | (0x4U << 8));

    /* 假设 PCLK2 = 72MHz, 115200bps => BRR ≈ 0x271 */
    USART1_BRR = 0x0271U;

    /* UE=1, TE=1, RE=1 */
    USART1_CR1 = (1U << 13) | (1U << 3) | (1U << 2);
}

static void usart1_send_char(char c)
{
    while ((USART1_SR & (1U << 7)) == 0); /* TXE */
    USART1_DR = (uint32_t)c;
}

static void usart1_send_str(const char *s)
{
    while (*s) usart1_send_char(*s++);
}
```

---

## 5. 裸机中断（EXTI 按键）

典型流程：
- GPIO 输入配置。
- AFIO 映射 EXTI 线。
- EXTI 触发沿选择 + 中断屏蔽位。
- NVIC 使能 IRQ。
- 在中断函数里清挂起位。

> 关键点：**一定清中断 pending 位**，否则会反复进中断。

---

## 6. 裸机定时器（TIM2）

用途：
- 精准周期中断（1ms tick）。
- PWM 输出（电机/舵机/调光）。
- 输入捕获（测频率/脉宽）。

1ms tick 思路：
1. 设定 PSC 先把时钟分频到 1MHz。
2. ARR 设为 1000-1。
3. 开更新中断 UIE。
4. NVIC 打开 TIM2 IRQ。
5. 在 `TIM2_IRQHandler` 做软定时任务调度。

---

## 7. 裸机调试建议

1. **先看寄存器再看现象**：用调试器观测 RCC/GPIO/USART 寄存器值。
2. 善用逻辑分析仪：验证串口波形、PWM 占空比。
3. 每次只新增一个外设，保证可回退。
4. 建立 `assert_param` 风格的自检宏（裸机也建议有断言）。

---

## 8. 常见坑（裸机高频）

- 没开外设时钟就写寄存器（配置无效）。
- 复用功能忘了配置 GPIO 模式（尤其串口、定时器通道）。
- 中断函数名写错，向量表没正确映射。
- 波特率计算用错时钟源（APB1/APB2 不同）。
- 清标志位时机不对，导致中断风暴。

---

## 9. 学习路线（建议）

1. 点灯 + 延时（RCC/GPIO）。
2. 串口打印（USART 轮询）。
3. 外部中断按键（EXTI + NVIC）。
4. 定时器中断（TIM 基础）。
5. PWM 输出。
6. ADC 采样 + DMA（进阶裸机）。
7. 最后再看 HAL，做对照学习。

---

## 10. 结论

在 EDB 方向下，建议项目优先采用 **裸机寄存器驱动** 方式实现基础功能；
仅在项目规模扩大、迭代速度优先时，再有选择地引入 HAL/LL。

如果你愿意，我可以下一步把这份文档继续拆成：
- `STM32-01-点灯裸机.md`
- `STM32-02-串口裸机.md`
- `STM32-03-中断与定时器裸机.md`
并附上可直接编译的最小工程模板（GCC + OpenOCD）。
