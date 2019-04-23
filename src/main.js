import api from "./api";

class App {
  constructor() {
    this.repositories = [];

    this.formElement = document.getElementById("repo-form");
    this.inputElement = document.querySelector("input[name=repository]");
    this.listElement = document.getElementById("repo-list");

    this.registerHandlers();
  }

  registerHandlers() {
    this.formElement.onsubmit = event => this.addRepository(event);
  }

  setLoading(loading = true) {
    if (loading === true) {
      let loadingElement = document.createElement("span");
      loadingElement.appendChild(document.createTextNode("Carregando"));
      loadingElement.setAttribute("id", "loading");

      this.formElement.appendChild(loadingElement);
    } else {
      document.getElementById("loading").remove();
    }
  }

  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputElement.value;

    if (repoInput === 0) {
      return;
    }

    try {
      const response = await api.get(`/repos/${repoInput}`);

      const {
        name,
        description,
        html_url,
        owner: { avatar_url }
      } = response.data;

      this.repositories.push({
        name: name,
        description: description,
        avatar_url: avatar_url,
        html_url: html_url
      });

      this.inputElement.value = "";

      this.render();
    } catch (err) {
      alert("O repositório não existe");
    }

    this.setLoading(false);
  }

  render() {
    this.listElement.innerHTML = "";

    this.repositories.forEach(repo => {
      let imgElement = document.createElement("img");
      imgElement.setAttribute("src", repo.avatar_url);

      let titleElement = document.createElement("strong");
      titleElement.appendChild(document.createTextNode(repo.name));

      let descriptionElement = document.createElement("p");
      descriptionElement.appendChild(document.createTextNode(repo.description));

      let htmlElement = document.createElement("a");
      htmlElement.setAttribute("target", "_blank");
      htmlElement.setAttribute("href", repo.html_url);
      htmlElement.appendChild(document.createTextNode("Acessar"));

      let liItemElement = document.createElement("li");
      liItemElement.appendChild(imgElement);
      liItemElement.appendChild(titleElement);
      liItemElement.appendChild(descriptionElement);
      liItemElement.appendChild(htmlElement);

      this.listElement.appendChild(liItemElement);
    });
  }
}

new App();
