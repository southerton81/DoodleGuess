class MessageBox {
    constructor(id, option) {
      this.id = id;
      this.option = option;
    }
    
    show(msg, label = "CLOSE") {  
      let option = this.option;
      let msgboxArea = document.querySelector(this.id);
      let msgboxBox = document.createElement("DIV");
      let msgboxContent = document.createElement("DIV");
      
      if (msgboxArea === null) {
        throw "Message container not found."
      }
  
      msgboxContent.classList.add("msgbox-content")
      msgboxContent.innerText = msg
      msgboxBox.classList.add("msgbox-box")
      msgboxBox.appendChild(msgboxContent)
      msgboxArea.appendChild(msgboxBox)
  
      if (option.closeAfterMs > 0) {
        this.msgboxTimeout = setTimeout(() => {
          this.hide(msgboxBox)
        }, option.closeAfterMs)
      }
    }
    
    hide(msgboxBox) {
      if (msgboxBox !== null) {
        msgboxBox.classList.add("msgbox-box-hide")
      }
      
      msgboxBox.addEventListener("transitionend", () => {
        if (msgboxBox !== null) {
          msgboxBox.parentNode.removeChild(msgboxBox);
          clearTimeout(this.msgboxTimeout);
        }
      })
    }
  }
  
  
  