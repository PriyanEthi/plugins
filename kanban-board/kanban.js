(function ($) {
  $.fn.kanbanBoard = function (options) {
    const settings = $.extend(
      {
        statuses: [],
        data: {
          config: {
            enableDelete: true,
          },
          kanbanData: [],
        },
        updateCardPositionUrl: "",
        deleteCardUrl: "",
      },
      options
    );

    let cardBeingDragged;

    function initializeBoards() {
      settings.statuses.forEach((item) => {
        let htmlString = `
                    <div class="board">
                        <h3 class="text-center">${item.title.toUpperCase()}</h3>
                        <div class="dropzone" id="${item.status}">
                        </div>
                    </div>
                `;
        this.append(htmlString);
      });

      let dropzones = document.querySelectorAll(".dropzone");
      dropzones.forEach((dropzone) => {
        dropzone.addEventListener("dragenter", dragenter);
        dropzone.addEventListener("dragover", dragover);
        dropzone.addEventListener("dragleave", dragleave);
        dropzone.addEventListener("drop", drop);
      });
    }

    function initializeCards() {
      let cards = document.querySelectorAll(".kanbanCard");
      cards.forEach((card) => {
        card.addEventListener("dragstart", dragstart);
        card.addEventListener("drag", drag);
        card.addEventListener("dragend", dragend);
      });
    }

    function initializeComponents() {
      settings.data.kanbanData.forEach((card) => {
        appendComponents(card);
      });
    }

    function appendComponents(card) {
      let status = settings.statuses.find((s) => s.status === card.status);
      let deleteButtonHtml = settings.data.config.enableDelete
        ? `<span class="deleteBtn" onclick="deleteCard(${card.id})"><i class="fas fa-trash"></i></span>`
        : "";

      let htmlString = `
                <div id=${card.id.toString()} class="kanbanCard ${
        card.status
      }" draggable="true" style="border-left: 5px solid ${status.color};">
                    <div class="content">
                        <h4 class="title">${card.title}</h4>
                        <p class="description">${card.description}</p>
                    </div>
                    <div class="text-end">
                        ${deleteButtonHtml}
                    </div>
                </div>
            `;
      $(`#${card.status}`).append(htmlString);
    }

    function removeClasses(cardBeingDragged, status) {
      settings.statuses.forEach((item) => {
        cardBeingDragged.classList.remove(item.status);
      });
      cardBeingDragged.classList.add(status);
      let newStatus = settings.statuses.find((s) => s.status === status);
      cardBeingDragged.style.borderLeft = `5px solid ${newStatus.color}`;
    }

    function updateCardPosition(cardBeingDragged, status) {
      var formData = new FormData();

      const cardId = parseInt(cardBeingDragged.id);
      formData.append("cardId", cardId);

      const newStatus = status;
      formData.append("newStatus", newStatus);

      $.ajax({
        url: settings.updateCardPositionUrl,
        type: "POST",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
          console.log("Kanban Data Updated");
        },
        error: function (error) {
          console.error("Kanban Data Error");
        },
      });
    }

    function deleteCard(cardId) {
      $.ajax({
        url: settings.deleteCardUrl,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          cardId: cardId,
        }),
        success: function (response) {
          console.log("Card deleted", response);
          $(`#${cardId}`).remove();
        },
        error: function (error) {
          console.error("Error", error);
        },
      });
    }

    function dragstart() {
      let dropzones = document.querySelectorAll(".dropzone");
      dropzones.forEach((dropzone) => dropzone.classList.add("highlight"));
      this.classList.add("is-dragging");
    }

    function drag() {}

    function dragend() {
      let dropzones = document.querySelectorAll(".dropzone");
      dropzones.forEach((dropzone) => dropzone.classList.remove("highlight"));
      this.classList.remove("is-dragging");
      let status = this.classList[1]; // Assuming status is the second class
      updateCardPosition(this, status);
    }

    function dragenter() {}

    function dragover({ target }) {
      this.classList.add("over");
      cardBeingDragged = document.querySelector(".is-dragging");
      settings.statuses.forEach((item) => {
        if (this.id === item.status) {
          removeClasses(cardBeingDragged, item.status);
        }
      });
      this.appendChild(cardBeingDragged);
    }

    function dragleave() {
      this.classList.remove("over");
    }

    function drop() {
      this.classList.remove("over");
    }

    initializeBoards.call(this);
    initializeComponents();
    initializeCards();

    return this;
  };
})(jQuery);
