export const footer = document.getElementById("footer")

footer.innerHTML = `
<footer class="uzum-footer" id="footer">
  <div class="wrapper">
    <div class="footer-sections">

      <div class="footer-col">
        <h4>О нас</h4>
        <ul>
          <li><a href="#">Пункты выдачи</a></li>
          <li><a href="#">Вакансии</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Пользователям</h4>
        <ul>
          <li><a href="#"> Связаться с нами </a></li>
          <li><a href="#">Вопрос - Ответ</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Для предпринимателей</h4>
        <ul>
        <li><a href="#">Продавайте на Uzum </a></li>
        <li><a href="#">Вход для продавцов </a></li>
          <li><a href="#"> Открыть пункт выдачи </a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Uzum в соцсетях </h4>
        <div class="social-icons">
          <a href="#"><img src="/public/icons/logo/instagramm.png" alt="IN"></a>
          <a href="#"><img src="/public/icons/logo/telegram.png" alt="TF"></a>
          <a href="#"><img src="/public/icons/logo/FB.png" alt="FB"></a>
          <a href="#"><img src="/public/icons/logo/YT.png" alt="YT"></a>
        </div>
        <br>
        <div class="footer-col">
        <h4>скачайте приложение </h4>
        <div class="app-social-icons">
          <a href="#"><img id="appStore2" src="/public/icons/logo/googlePlay.png" alt=""></a>
          <a href="#"><img id="appStore" src="/public/icons/logo/appStore(2).png" alt=""></a>
        </div>
      </div>
      </div>

      

    </div>

    <div class="footer-bottom">
      <p>«2025© ООО «UZUM MARKET». ИНН 309376127. Все права защищены»</p>
      <div class="policies">
        <a href="#">Политика конфиденциальности</a>
        <a href="#">Условия использования</a>
        <a href="#">Cookie‑политика</a>
      </div>
    </div>
  </div>
</footer>`