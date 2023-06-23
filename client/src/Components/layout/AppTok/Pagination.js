// ! https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react-ru

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
  console.log("ДИАПАЗОН from, to ", from, to);
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }
  console.log("ДИАПАЗОН range ", range);
  return range;
};

class Pagination extends Component {
  constructor(props) {
    console.log("Pag props ", props);
    super(props);
    const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = props;

    this.pageLimit = typeof pageLimit === "number" ? pageLimit : 30;
    console.log("Pag Предел страницы ", pageLimit);
    this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;
    console.log("Pag Общие записи ", totalRecords);

    this.pageNeighbours =
      typeof pageNeighbours === "number"
        ? Math.max(0, Math.min(pageNeighbours, 2))
        : 0;
    console.log("Pag Страница соседей ", pageNeighbours);

    this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);
    // console.log("totalPages ", totalPages);

    this.state = { currentPage: 1 };
    // console.log('state ', state);
  }

  componentDidMount() {
    this.gotoPage(1);
  }

  gotoPage = (page) => {
    const { onPageChanged = (f) => f } = this.props;

    // текущая страница
    const currentPage = Math.max(0, Math.min(page, this.totalPages));
    console.log("Pag текщ.стран ", currentPage);

    // Данные о странице
    const paginationData = {
      currentPage,
      totalPages: this.totalPages,
      pageLimit: this.pageLimit,
      totalRecords: this.totalRecords,
    };
    console.log("Pag данн.стр. ", paginationData);
    console.log(paginationData);

    this.setState({ currentPage }, () => onPageChanged(paginationData));
  };
  // обраб.клик
  handleClick = (page, evt) => {
    console.log("Pag обраб.клик ", page, evt);
    evt.preventDefault();
    this.gotoPage(page);
  };
  // обработчик движется влево
  handleMoveLeft = (evt) => {
    console.log("Pag обраб.движ.лево ", evt);
    evt.preventDefault();
    this.gotoPage(this.state.currentPage - this.pageNeighbours * 2 - 1);
  };

  // обработчик движется прав
  handleMoveRight = (evt) => {
    console.log("Pag обраб.движ.прав ", evt);
    evt.preventDefault();
    this.gotoPage(this.state.currentPage + this.pageNeighbours * 2 + 1);
  };
  // получить номера страниц
  fetchPageNumbers = () => {
    console.log("Pag п.№стр. ", 1);
    const totalPages = this.totalPages;
    const currentPage = this.state.currentPage;
    const pageNeighbours = this.pageNeighbours;

    const totalNumbers = this.pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;
    console.log("Pag п.№стр. общие блоки ", totalBlocks);

    // общие блоки
    if (totalPages > totalBlocks) {
      console.log("Pag п.№стр. общ.бл-IF ", totalBlocks);
      let pages = [];

      const leftBound = currentPage - pageNeighbours;
      console.log("Pag п.№стр. общ.бл-IF лев.гранц ", leftBound);
      const rightBound = currentPage + pageNeighbours;
      console.log("Pag п.№стр. общ.бл-IF прав.гранц ", rightBound);
      const beforeLastPage = totalPages - 1;
      console.log("Pag п.№стр. общ.бл-IF >послед.стр. ", beforeLastPage);

      const startPage = leftBound > 2 ? leftBound : 2;
      console.log("Pag п.№стр. общ.бл-IF startPage ", startPage);
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;
      console.log("Pag п.№стр. общ.бл-IF endPage ", endPage);

      pages = range(startPage, endPage);
      console.log("Pag п.№стр. общ.бл-IF страницы ", pages);

      const pagesCount = pages.length;
      console.log("Pag п.№стр. общ.бл-IF количество страниц ", pagesCount);
      const singleSpillOffset = totalNumbers - pagesCount - 1;
      console.log(
        "Pag п.№стр. общ.бл-IF одиночное смещение разлива ",
        singleSpillOffset
      );

      const leftSpill = startPage > 2;
      console.log("Pag п.№стр. общ.бл-IF левый разлив ", leftSpill);
      const rightSpill = endPage < beforeLastPage;
      console.log("Pag п.№стр. общ.бл-IF правый разлив ", rightSpill);

      const leftSpillPage = LEFT_PAGE;
      console.log(
        "Pag п.№стр. общ.бл-IF левая страница разлива ",
        leftSpillPage
      );
      const rightSpillPage = RIGHT_PAGE;
      console.log(
        "Pag п.№стр. общ.бл-IF правая страница разлива ",
        rightSpillPage
      );

      if (leftSpill && !rightSpill) {
        console.log("Pag п.№стр. if 111 ", 111);
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        console.log("Pag п.№стр. els if 222 ", 222);
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        console.log("Pag п.№стр. els if 3333 ", 3333);
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }
      console.log("Pag п.№стр. общ.бл-IF return  ", [1, ...pages, totalPages]);
      return [1, ...pages, totalPages];
    }

    console.log("Pag п.№стр. range(1, totalPages)  ", range(1, totalPages));
    return range(1, totalPages);
  };

  render() {
    if (!this.totalRecords) {
      console.log("Pag RND --- Общ.записи ");
      return null;
    }

    if (this.totalPages === 1) {
      console.log("Pag RND общ.стр. 1 " + 1);
      return null;
    }

    const { currentPage } = this.state;
    console.log("Pag RND текщ.стр. ", currentPage);
    const pages = this.fetchPageNumbers();
    console.log("Pag RND страницы ", pages);

    return (
      <Fragment>
        <nav aria-label="Countries Pagination">
          <ul className="pagination">
            {pages.map((page, index) => {
              if (page === LEFT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href="!#"
                      aria-label="Previous"
                      onClick={this.handleMoveLeft}
                    >
                      <span aria-hidden="true">&laquo;</span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                );

              if (page === RIGHT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href="!#"
                      aria-label="Next"
                      onClick={this.handleMoveRight}
                    >
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                );

              return (
                <li
                  key={index}
                  className={`page-item${
                    currentPage === page ? " active" : ""
                  }`}
                >
                  <a
                    className="page-link"
                    href="!#"
                    onClick={(e) => this.handleClick(page, e)}
                  >
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Fragment>
    );
  }
}

Pagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageNeighbours: PropTypes.number,
  onPageChanged: PropTypes.func,
};

export default Pagination;
