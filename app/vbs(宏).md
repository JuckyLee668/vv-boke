## varible
```
Private Sub say_helloworld_Click()
   Dim password As String
   password = "Admin#1"

   Dim num As Integer
   num = 1234

   Dim BirthDay As Date
   BirthDay = DateValue("30 / 10 / 2020")

   MsgBox "Passowrd is " & password & Chr(10) & "Value of num is " &
      num & Chr(10) & "Value of Birthday is " & BirthDay
End Sub
```
---
创建目录
```
Sub makeContents()
  Dim Arr(), total As Integer

  total = Sheets.Count
  
  ReDim Arr(0 To total)
  
  For i = 1 To total
    Arr(i) = Sheets(i).Name
    Range("A" & i).Value = Arr(i)
    
    Next i
  
End Sub
 
```
## for 
```
Sub 合并格式()
'
' 合并格式 宏
'

For i = 1 To 10

    Sheets.Add After:=ActiveSheet
    Range("C2").Select
    ActiveCell.FormulaR1C1 = "表单题目"
    Range("C2:G2").Select
    With Selection
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
        .WrapText = False
        .Orientation = 0
        .AddIndent = False
        .IndentLevel = 0
        .ShrinkToFit = False
        .ReadingOrder = xlContext
        .MergeCells = False
    End With
    Selection.Merge
    Next i
End Sub
```

## if else

```
Sub 成绩判断()
'
' 合并格式 宏
'

If Range("G9").Value > 90 Then
   Range("H9").Value = "优秀"
ElseIf Range("G9").Value > 80 Then
   Range("H9").Value = "良好"
ElseIf Range("G9").Value > 60 Then
   Range("H9").Value = "及格"
Else
    Range("H9").Value = "不及格"
End If

End Sub

```


## switch
```
Private Sub switch_demo_Click()
   Dim MyVar As Integer
   MyVar = 1
     Select Case MyVar
      Case 1
         MsgBox "The Number is the Least Composite Number"
      Case 2
         MsgBox "The Number is the only Even Prime Number"
      Case 3
         MsgBox "The Number is the Least Odd Prime Number"
      Case Else
         MsgBox "Unknown Number"
   End Select
End Sub
```

## forEach

```
Private Sub Constant_demo_Click()    
	'fruits is an array
   fruits = Array("apple", "orange", "cherries")
   Dim fruitnames As Variant
 
   'iterating using For each loop.
   For Each Item In fruits
      fruitnames = fruitnames & Item & Chr(10)
   Next
      MsgBox fruitnames
End Sub
```
## while
```
Private Sub Constant_demo_Click()
   Do While i < 5
      i = i + 1
      msgbox "The value of i is : " & i
   Loop
End Sub
```

## function
split
```
Sub Constant_demo_Click()
   Dim a As Variant
   a = Split("1999-123210-0h900-23210-21321", "-")


    Range("A1:G1").Value = a
End Sub

```