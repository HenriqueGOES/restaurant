window.onload = function () {
    const form = document.querySelector("#form");
    const inputTitle = document.querySelector("#title");
    const inputDescription = document.querySelector("#description");
    const inputDate = document.querySelector("#date");
    const tasksList = document.querySelector("#tasksList");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const task = {
        titulo: inputTitle.value,
        descricao: inputDescription.value,
        data: inputDate.value,
      };
      form.submit();
    });
  };
  