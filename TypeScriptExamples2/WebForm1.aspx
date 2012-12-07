<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="TypeScriptExamples2.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script>
        function test() {
            var start = (new Date).getTime();
            for (var i = 0; i < 10000; i++) {
                var s = 'pnl_' + i;
                var elm = document.getElementById(s);
                //var elm = document.getElementById('pnl_9998x');
            }
            var end = (new Date).getTime() - start;
            alert(end);
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <input type="button" value="test" onclick="test()"/>
    <div>
        <asp:Panel ID="Panel1" runat="server"></asp:Panel>
    
    </div>
    </form>
</body>
</html>
