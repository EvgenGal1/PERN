// ! https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react-ru

import React, { useEffect, useState } from "react";
// import Countries from "countries-api/lib/data/Countries.json";
// import "./App.css";

import CountryCard from "./CountryCard.js";
import Pagination from "../../common/Pagination.js";

const Countries = [
  {
    cca2: "NG1",
    region: "Africa1",
    name: {
      common: "Nigeria1",
    },
  },
  {
    cca2: "NG2",
    region: "Africa2",
    name: {
      common: "Nigeria2",
    },
  },
  {
    cca2: "NG3",
    region: "Africa3",
    name: {
      common: "Nigeria3",
    },
  },
  {
    cca2: "NG4",
    region: "Africa4",
    name: {
      common: "Nigeria4",
    },
  },
  {
    cca2: "NG5",
    region: "Africa5",
    name: {
      common: "Nigeria5",
    },
  },
  {
    cca2: "NG6",
    region: "Africa6",
    name: {
      common: "Nigeria6",
    },
  },
  {
    cca2: "NG7",
    region: "Africa7",
    name: {
      common: "Nigeria7",
    },
  },
  {
    cca2: "NG8",
    region: "Africa8",
    name: {
      common: "Nigeria8",
    },
  },
  {
    cca2: "NG9",
    region: "Africa9",
    name: {
      common: "Nigeria9",
    },
  },
  {
    cca2: "NG10",
    region: "Africa10",
    name: {
      common: "Nigeria10",
    },
  },
  {
    cca2: "11",
    region: "11",
    name: {
      common: "11",
    },
  },
  {
    cca2: "12",
    region: "12",
    name: {
      common: "12",
    },
  },
  {
    cca2: "13",
    region: "13",
    name: {
      common: "13",
    },
  },
  {
    cca2: "14",
    region: "14",
    name: {
      common: "14",
    },
  },
  {
    cca2: "15",
    region: "15",
    name: {
      common: "15",
    },
  },
  {
    cca2: "16",
    region: "16",
    name: {
      common: "16",
    },
  },
  {
    cca2: "17",
    region: "17",
    name: {
      common: "17",
    },
  },
  {
    cca2: "18",
    region: "18",
    name: {
      common: "18",
    },
  },
  {
    cca2: "19",
    region: "19",
    name: {
      common: "19",
    },
  },
  {
    cca2: "20",
    region: "20",
    name: {
      common: "20",
    },
  },
  {
    cca2: "__21",
    region: "__21",
    name: {
      common: "__21",
    },
  },
  {
    cca2: "__22",
    region: "__22",
    name: {
      common: "__22",
    },
  },
  {
    cca2: "__23",
    region: "__23",
    name: {
      common: "__23",
    },
  },
  {
    cca2: "__24",
    region: "__24",
    name: {
      common: "__24",
    },
  },
  {
    cca2: "__25",
    region: "__25",
    name: {
      common: "__25",
    },
  },
  {
    cca2: "__26",
    region: "__26",
    name: {
      common: "__26",
    },
  },
  {
    cca2: "__27",
    region: "__27",
    name: {
      common: "__27",
    },
  },
];

const App = () => {
  // список всех стран
  const [allCountries, setAllCountries] = useState([]);
  console.log("список всех стран usSt ", allCountries);
  // текущие страны
  const [currentCountries, setCurrentCountries] = useState([]);
  console.log("текущие страны usSt ", currentCountries);
  // текущая страница
  const [currentPage, setCurrentPage] = useState(null);
  console.log("текущая страница usSt ", currentPage);
  // общие страницы
  const [totalPages, setTotalPages] = useState(null);
  console.log("общие страницы usSt ", totalPages);

  // загр.всех стран из масс.
  useEffect(() => {
    setAllCountries(Countries);
  }, []);

  // на странице изменилось
  const onPageChanged = (data) => {
    const { currentPage, pageLimit } = data;
    console.log("измен.стр. Предел.стр., текщ.стр.  ", pageLimit, currentPage);

    // компенсировать
    const offset = (currentPage - 1) * pageLimit;
    console.log("измен.стр. компенсировать ofset ", offset);
    // нынешние страны
    const currentCountries = allCountries.slice(offset, offset + pageLimit);
    console.log("измен.стр. нынеш/страны ", currentCountries);

    setCurrentPage(currentPage);
    setCurrentCountries(currentCountries);
    setTotalPages(Math.ceil(allCountries.length / pageLimit));
  };

  const totalCountries = allCountries.length;
  console.log("Всего стран ", totalCountries);

  if (totalCountries === 0) return null;

  const headerClass = [
    "text-dark py-2 pr-4 m-0",
    currentPage ? "border-gray border-right" : "",
  ]
    .join(" ")
    .trim();

  return (
    <div className="container mb-5">
      <div className="row d-flex flex-row py-5">
        <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <h2 className={headerClass}>
              <strong className="text-secondary">{totalCountries}</strong>{" "}
              Страны
            </h2>
            {currentPage && (
              <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                <span className="font-weight-bold">{totalPages}</span>
              </span>
            )}
          </div>
          <div className="d-flex flex-row py-4 align-items-center">
            <Pagination
              // Общие записи
              totalRecords={totalCountries}
              // Предел страницы
              pageLimit={5}
              // Страница соседей
              pageNeighbours={1}
              // на странице изменилось
              onPageChanged={onPageChanged}
            />
          </div>
        </div>
        {currentCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>
    </div>
  );
};

export default App;
