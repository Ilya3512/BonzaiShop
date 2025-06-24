import { useEffect, useState } from "react";
import "./Katalog.css";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";

import usePlants from "./Items";
import { useCart } from "../../basket/CartContext";

const SORT_OPTIONS = [
  { value: "", label: "Выберите сортировку" },
  { value: "title_abc", label: "По алфавиту (А-Я)" },
  { value: "title_cba", label: "По алфавиту (Я-А)" },
  { value: "price_up", label: "По цене (возрастание)" },
  { value: "price_down", label: "По цене (убывание)" },
];

const SORT_OPTIONS_TYPE = [
  { value: "", label: "Все типы" },
  { value: "coniferous", label: "Хвойные" },
  { value: "deciduous", label: "Лиственные" },
  { value: "blooming", label: "Цветущие" },
];

function sortItems(plants, sortKey) {
  const sortedItems = [...plants];

  if (!sortKey) return sortedItems;

  sortedItems.sort((a, b) => {
    if (sortKey === "title_abc") {
      return a.title.localeCompare(b.title);
    } else if (sortKey === "title_cba") {
      return b.title.localeCompare(a.title);
    } else if (sortKey === "price_up") {
      return (
        parseInt(a.price.replace(/\s+/g, "")) -
        parseInt(b.price.replace(/\s+/g, ""))
      );
    } else if (sortKey === "price_down") {
      return (
        parseInt(b.price.replace(/\s+/g, "")) -
        parseInt(a.price.replace(/\s+/g, ""))
      );
    }
    return 0;
  });

  return sortedItems;
}

const Item = () => {
  const { plants } = usePlants();

  const location = useLocation();
  const query = queryString.parse(location.search);
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState(query.sort || "");
  const [filterType, setFilterType] = useState(query.type || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedItems, setSortedItems] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const filteredItems = plants.filter((item) => {
      if (item.status === "false" || item.status === false) return false;

      if (filterType) {
        switch (filterType) {
          case "coniferous":
            if (item.type !== "Хвойный") return false;
            break;
          case "deciduous":
            if (item.type !== "Лиственный") return false;
            break;
          case "blooming":
            if (item.type !== "Цветущий") return false;
            break;
          default:
            return true;
        }
      }

      const matchesSearchTerm = item.title
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());

      const itemPrice = parseInt(item.price.replace(/\s+/g, ""));
      const min = minPrice ? parseInt(minPrice.replace(/\s+/g, "")) : 0;
      const max = maxPrice ? parseInt(maxPrice.replace(/\s+/g, "")) : Infinity;

      return matchesSearchTerm && itemPrice >= min && itemPrice <= max;
    });

    const newSortedItems = sortItems(filteredItems, sortKey);
    setSortedItems(newSortedItems);

    const params = [];
    if (sortKey) params.push(`sort=${sortKey}`);
    if (filterType) params.push(`type=${filterType}`);
    if (minPrice) params.push(`minPrice=${minPrice}`);
    if (maxPrice) params.push(`maxPrice=${maxPrice}`);
    if (searchTerm) params.push(`search=${searchTerm}`);

    navigate(`?${params.join("&")}`);
  }, [plants, sortKey, filterType, minPrice, maxPrice, searchTerm, navigate]);

  const handleSortChange = (event) => {
    setSortKey(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    const rawValue = event.target.value.replace(/\s/g, "");
    const formattedValue = formatNumber(rawValue);
    setMinPrice(formattedValue);
  };

  const handleMaxPriceChange = (event) => {
    const rawValue = event.target.value.replace(/\s/g, "");
    const formattedValue = formatNumber(rawValue);
    setMaxPrice(formattedValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const formatNumber = (numberString) => {
    if (!numberString) return "";
    const number = Number(numberString);
    return isNaN(number) ? "" : number.toLocaleString("ru-RU");
  };

  const getSortTitle = () => {
    switch (sortKey) {
      case "title_abc":
        return "Каталог отсортированы по алфавиту (А-Я)";
      case "title_cba":
        return "Каталог отсортированы по алфавиту (Я-А)";
      case "price_up":
        return "Каталог отсортированы по цене (возрастание)";
      case "price_down":
        return "Каталог отсортированы по цене (убывание)";
      default:
        return "Каталог бонсаев";
    }
  };

  const clearFilters = () => {
    setFilterType("");
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
  };

  const handleFilterToggle = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <>
      {isFilterVisible && (
        <div className="overlay" onClick={handleFilterToggle}></div>
      )}
      <h1 className={`header-indentation ${isFilterVisible ? "dimmed" : ""}`}>
        {getSortTitle()}
      </h1>
      <div className="sorting-panel_inner">
        <div className={`filter-section ${isFilterVisible ? "active" : ""}`}>
          <button className="filter-button" onClick={handleFilterToggle}>
            Фильтр
          </button>
          {isFilterVisible && (
            <div className="filter-panel transparent-panel">
              <div className="filter-header">
                <h2>Фильтр</h2>
              </div>
              <button
                className="button-close"
                onClick={() => {
                  clearFilters();
                  setIsFilterVisible(false);
                }}
              >
                &times;
              </button>
              <div className="filter-item_container">
                <div className="filter-item">
                  <div className="filter-title">По типу</div>
                  <select
                    className="sorting-select"
                    value={filterType}
                    onChange={handleFilterChange}
                  >
                    {SORT_OPTIONS_TYPE.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-item">
                  <div className="filter-title">Цена р.</div>
                  <div className="price-filter_container">
                    <div className="price-filter">
                      <input
                        type="text"
                        placeholder="Цена от"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="price-input-from"
                      />
                      <input
                        type="text"
                        placeholder="Цена до"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="price-input-to"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="filter-actions">
                <button className="button-cancel" onClick={clearFilters}>
                  Очистить фильтр
                </button>
                <button
                  className="button-style"
                  onClick={() => setIsFilterVisible(false)}
                >
                  Подтвердить
                </button>
              </div>
            </div>
          )}
        </div>
        <select
          className="sorting-select"
          value={sortKey}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Введите название товара"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="grid-container">
        {sortedItems.map((item) => (
          <div key={item.id} className="grid-elem">
            <Link to={item.slug} className="itemLink"></Link>
            {item.img && (
              <Link to={item.slug} className="itemLink">
                <img src={item.img} alt={item.title} className="item-image" />
              </Link>
            )}
            <div className="product-item_heading">
              <Link to={item.slug} className="itemLink">
                {item.title}
              </Link>
              <p className="item-price">{item.price} ₽</p>
              <button className="button-style" onClick={() => addToCart(item)}>
                Добавить в корзину
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

function Katalog() {
  return (
    <div className="main">
      <div className="main-inner">
        <div className="indent" />
        <div className="katalog">
          <Item />
        </div>
      </div>
    </div>
  );
}

export { Katalog };
