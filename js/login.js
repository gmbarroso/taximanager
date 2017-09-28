function validateForm() {
  var x = document.forms["myForm"]["fname"].value;
  var atpos = x.indexOf("@");
  var dotpos = x.lastIndexOf(".");
  if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
    alert("Esse endereço de e-mail não é válido");
    return false;
  }
  var y = document.forms["myForm"]["fpass"].value;
  if (x == "" && x != x.indexOf("@")) {
    alert("O campo usuário deve ser preenchido");
    return false;
  }
  if (y == "") {
    alert("O campo senha deve ser preenchido");
    return false;
  }
}
