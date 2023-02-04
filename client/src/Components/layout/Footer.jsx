function Footer(props) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer__menu">
          <div className="footer__menu-top f-menu-top">
            <h5>Содержание нижнего колонтитула</h5>
            <p>Заполнитель например текстом</p>
            <p>Заполнитель например текстом</p>
            <p>Заполнитель например текстом</p>
          </div>
          <div className="footer__menu-bottom f-menu-bottom">
            <h5 className="">Благодарности За Разное</h5>
            {/* <p>За помощь/уроки/материалы</p> */}
            <ul className="f-menu-bottom__itemss">
              <li className="f-menu-bottom__item">
                <a
                  href="https://www.youtube.com/c/VladilenMinin"
                  target="_blank"
                  rel="noreferrer"
                >
                  Владилен Минин
                </a>
              </li>
              <li className="f-menu-bottom__item">
                <a
                  href="https://www.youtube.com/c/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%D0%9D%D0%B5%D0%BF%D0%BE%D0%BC%D0%BD%D1%8F%D1%89%D0%B8%D0%B9"
                  target="_blank"
                  rel="noreferrer"
                >
                  Михаил Непомнящий
                </a>
              </li>
              <li className="f-menu-bottom__item">
                <a
                  href="https://www.youtube.com/c/UlbiTV"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ulbi TV
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__copyright">
        <div className="copyright-container">
          <span>© 2022 EvGen Gal</span>
          <a className="" href="#!">
            Всем Добра Дзыы))
          </a>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
