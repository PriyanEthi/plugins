/*!
 * jQuery Custom Datatable v1.0.0
 * https://www.linkedin.com/in/priyan-ethi-062713104/
 *
 * Copyright 2024 Priyan
 * Released under the MIT license
 *
 * Developed for customized personal usage and published for public users.
 */

$.fn.customdatatable = function () {
  const $table = this;
  let data = [];
  let currentPage = 1;
  let rowsPerPage = 10;
  let sortColumn = null;
  let sortDirection = "asc";

  function initializeData() {
    $table.find("tbody tr").each(function () {
      const row = {};
      $(this)
        .find("td")
        .each(function (index) {
          row[$table.find("thead th").eq(index).text().toLowerCase()] =
            $(this).text();
        });
      data.push(row);
    });
  }

  function renderTable() {
    let filteredData = filterData(data);
    let sortedData = sortData(filteredData);
    let paginatedData = paginateData(sortedData);
    renderRows(paginatedData);
    renderPagination(filteredData.length);
    updateSortIcons();
  }

  function filterData(data) {
    const searchTerm = $("#searchInput").val().toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm)
      )
    );
  }

  function sortData(data) {
    if (!sortColumn) return data;
    return data.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  function paginateData(data) {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }

  function renderRows(data) {
    const $tbody = $table.find("tbody");
    $tbody.empty();
    if (data.length === 0) {
      $tbody.append(
        '<tr><td colspan="7" class="text-center">No records found</td></tr>'
      );
    } else {
      data.forEach((row) => {
        const $tr = $("<tr>");
        Object.values(row).forEach((cell) => {
          $tr.append($("<td>").text(cell));
        });
        $tbody.append($tr);
      });
    }
  }

  function renderPagination(totalRows) {
    const $pagination = $(".pagination");
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    $pagination.empty();
    for (let i = 1; i <= totalPages; i++) {
      const $pageItem = $("<li>")
        .addClass("page-item")
        .toggleClass("active", i === currentPage);
      const $pageLink = $("<a>")
        .addClass("page-link")
        .attr("href", "#")
        .text(i);
      $pageItem.append($pageLink);
      $pagination.append($pageItem);
    }
  }

  function handleSearch() {
    currentPage = 1;
    renderTable();
  }

  function handleSort(column) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }
    renderTable();
  }

  function handlePageClick(event) {
    event.preventDefault();
    currentPage = parseInt($(this).text());
    renderTable();
  }

  function updateSortIcons() {
    $table.find("thead th").each(function () {
      const columnData = $(this).html();
      const column = getColumnName(columnData).toLowerCase();

      $(this).find(".sort-icon").remove();
      if (sortColumn === column) {
        const icon = sortDirection === "asc" ? "▲" : "▼";
        $(this).append('<span class="sort-icon">' + icon + "</span>");
      } else {
        $(this).append('<span class="sort-icon">⇵</span>');
      }
    });
  }

  function getColumnName(input) {
    const parts = input.split(/<span.*?>/);
    const name = parts[0].trim();
    return name;
  }

  $("#searchButton").on("click", handleSearch);
  $("#sortDropdown").on("change", function () {
    const selectedOption = $(this).val();
    handleSort(selectedOption);
  });
  $(document).on("click", ".pagination a", handlePageClick);

  $table.find("thead th").on("click", function () {
    const columnData = $(this).html();
    const column = getColumnName(columnData).toLowerCase();
    handleSort(column);
  });

  initializeData();
  renderTable();
  return this;
};
