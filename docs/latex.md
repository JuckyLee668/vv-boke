# LaTeX 的书写技巧

## 基本结构

一个简单的 LaTeX 文档结构如下：

```latex
%!TEX encoding = UTF-8 Unicode %避免出现中文不兼容
%!TEX program = xelatex  %使用xelatex为编译器
\documentclass{article}  可使用自定义包
\begin{document}
Hello, world!
\end{document}
```

## 常用命令

### 标题

使用 `\section`、`\subsection` 和 `\subsubsection` 来创建标题：

```latex
\section{一级标题}
\subsection{二级标题}
\subsubsection{三级标题}
```

### 强调

使用 `\textbf` 和 `\textit` 来加粗和斜体：

```latex
\usepackage{xeCJK}
\setCJKmainfont{SimSun}[AutoFakeBold,ItalicFont=KaiTi]  %宋体和楷体

\begin{document}
\textbf{加粗文本}  %宋体加粗
\textit{斜体文本}  %楷体
\end{document}
```

### 列表

创建无序列表和有序列表：

```latex
\begin{itemize}
    \item 无序列表项
    \item 无序列表项
\end{itemize}

\begin{enumerate}
    \item 有序列表项
    \item 有序列表项
\end{enumerate}
```

### 数学公式

行内公式使用 `$...$`，行间公式使用 `\[...\]`：

```latex
这是一个行内公式 $E = mc^2$。

这是一个行间公式：
\[
E = mc^2
\]
```

### 插入图片

使用 `\includegraphics` 插入图片：

```latex
\usepackage{graphicx}  %导入包
\graphicspath{{figures/}}  %定义图片路径
\begin{document}

\begin{figure}[htbp]   %htbp为浮动格式  H为引用位置
	\centering
	\includegraphics[width=.6\textwidth]{1.1}  %图片名称，无后缀
	\caption{部分厂家中标情况汇总}  %图片下标题
	\label{fig:1.1}  %调用标签
\end{figure}

\ref{fig:1.1}  %文章中调用

\end{document}
```

### 参考文献

使用 `\cite{}` 引用文献：

```latex
\begin{document}
	
	有序列表项\cite{2019Big}
	
\bibliographystyle{plain} %参考文献格式 
\bibliography{ref}  %Bibtex 文件名
\end{document}
```
ref.bib
```latex
@article{2019Big,
	title={Big data‐driven machine learning‐enabled traffic flow prediction},
	author={ Fanhui, Kong  and  Jian, Li  and  Bin, Jiang  and  Tianyuan, Zhang  and  Houbing, Song },
	journal={Transactions on Emerging Telecommunications Technologies},
	volume={30},
	pages={e3482-},
	year={2019},
}
```

### 表格

创建简单表格：

```latex
\usepackage{multirow}
\begin{document}
\begin{table}
		\centering
		\caption{空气悬浮粒子标准}
		\label{142}
		\begin{tabular}{|c|c|c|c|c|}
			\hline
			\multirow{3}{*}{洁净度级别} & \multicolumn{4}{c|}{悬浮粒子最大允许数／$m^3$} \\
			\cline{2-5}
			& \multicolumn{2}{c|}{静态} & \multicolumn{2}{c|}{动态} \\
			\cline{2-5}
			& ≥0.5μm & ≥5.0μm & ≥0.5μm & ≥5.0μm \\
			\hline
			B & 3520 & 29 & 3520 & 2900 \\
			
			\hline
		\end{tabular}
\end{table}
\end{document}
```

## 其他技巧

- 使用 `\footnote` 添加脚注。
- 排版子图  \usepackage{subcaption}
- 使用 \usepackage{pdflscape} 包可以旋转页面
```latex
\begin{landscape}
XXXXXXXXXXXX
\end{landscape}
```

## 进阶技巧

### 并列表格
```latex
\documentclass{article}

\usepackage{floatrow}
\floatsetup[table]{capposition=top}
\newfloatcommand{capbtabbox}{table}[][\FBwidth]

\begin{document}

\begin{table*}
\begin{floatrow}
\capbtabbox{
 \begin{tabular}{cc}
 \hline
 Author & Title \\
 \hline
 Knuth & The \TeX book \\
 Lamport & \LaTeX \\
 \hline
 \end{tabular}
}{
 \caption{A table.}
 \label{tab:tb1}
}
\capbtabbox{
 \begin{tabular}{cc}
 \hline
 Author & Title \\
 \hline
 Knuth & The \TeX book \\
 Lamport & \LaTeX \\
 \hline
 \end{tabular}
}{
 \caption{B table.}
 \label{tab:tb2}
}
\end{floatrow}
\end{table*}

\end{document}

```
### 表格固定宽度且居中
```latex
\usepackage{array} %表格（固定宽度且居中）


\begin{tabular}{|p{3cm}<{\centering}|p{4cm}|p{6cm}|}
    \hline
    换元名称 & 被积函数特点 & 具体换元公式 \\
    \hline
\end{tabular}
```

### 自定义命令

使用 `\newcommand` 创建自定义命令：

```latex
\newcommand{\vect}[1]{\mathbf{#1}}
\begin{document}
这是一个向量 $\vect{v}$。
\end{document}
```

### 多列布局

使用 `multicol` 包创建多列布局：

```latex
\usepackage{multicol}
\begin{document}
\begin{multicols}{2}
这是第一列的内容。

这是第二列的内容。
\end{multicols}
\end{document}
```

### 颜色

使用 `xcolor` 包添加颜色：

```latex
\usepackage{xcolor}
\begin{document}
这是 \textcolor{red}{红色文本} 和 \textcolor{blue}{蓝色文本}。
\end{document}
```

### 超链接

使用 `hyperref` 包添加超链接：

```latex
\usepackage{hyperref}
\begin{document}
这是一个 \href{https://www.example.com}{链接}。
\end{document}
```

### 代码高亮

使用 `listings` 包进行代码高亮：

```latex
\usepackage{listings}
\begin{document}
\begin{lstlisting}[language=Python]
def hello_world():
    print("Hello, world!")
\end{lstlisting}
\end{document}
```
