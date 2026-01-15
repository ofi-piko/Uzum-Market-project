export const footer = document.getElementById("footer")

footer.innerHTML = `
<footer id="footer" style="
    margin-top:15px;
    bottom:0;
    left:0;
    width:100%;
    background:#f9f9f9;
    font-family:Arial, sans-serif;
    padding:20px 0;
    color:#333;
    border-top:1px solid #e2e2e2;
    z-index:100;
">
  <div class="wrapper" style="
      width:90%;
      max-width:1150px;
      margin:0 auto;
      display:flex;
      flex-direction:column;
  ">

    <div class="footer-sections" style="
        display:flex;
        flex-wrap:wrap;
        gap:30px;
    ">

      <div class="footer-col" style="flex:1 1 200px;">
        <h4 style="font-size:16px;margin-bottom:12px;font-weight:bold;">О нас</h4>
        <ul style="list-style:none;padding:0;margin:0;">
          <li style="margin-bottom:8px;">
            <a href="#" style="text-decoration:none;color:#555;font-size:14px;">Пункты выдачи</a>
          </li>
          <li style="margin-bottom:8px;">
            <a href="#" style="text-decoration:none;color:#555;font-size:14px;">Вакансии</a>
          </li>
        </ul>
      </div>

      <div class="footer-col" style="flex:1 1 200px;">
        <h4 style="font-size:16px;margin-bottom:12px;font-weight:bold;">Пользователям</h4>
        <ul style="list-style:none;padding:0;margin:0;">
          <li style="margin-bottom:8px;">
            <a href="#" style="text-decoration:none;color:#555;font-size:14px;">Связаться с нами</a>
          </li>
          <li style="margin-bottom:8px;">
            <a href="#" style="text-decoration:none;color:#555;font-size:14px;">Вопрос - Ответ</a>
          </li>
        </ul>
      </div>

      <div class="footer-col" style="flex:1 1 200px;">
        <h4 style="font-size:16px;margin-bottom:12px;font-weight:bold;">Для предпринимателей</h4>
        <ul style="list-style:none;padding:0;margin:0;">
          <li style="margin-bottom:8px;">
            <a href="#" style="text-decoration:none;color:#555;font-size:14px;">Продавайте на Uzum</a>
          </li>
          <li style="margin-bottom:8px;">
            <a href="#" style="text-decoration:none;color:#555;font-size:14px;">Вход для продавцов</a>
          </li>
          <li style="margin-bottom:8px;">
            <a href="#" style="text-decoration:none;color:#555;font-size:14px;">Открыть пункт выдачи</a>
          </li>
        </ul>
      </div>

      <div class="footer-col" style="flex:1 1 200px;">
        <h4 style="font-size:16px;margin-bottom:12px;font-weight:bold;">Uzum в соцсетях</h4>
        <div style="display:flex;gap:12px;">
          <a href="#"><img src="/public/icons/logo/instagramm.png" style="width:25px;height:25px;"></a>
          <a href="#"><img src="/public/icons/logo/telegram.png" style="width:25px;height:25px;"></a>
          <a href="#"><img src="/public/icons/logo/FB.png" style="width:25px;height:25px;"></a>
          <a href="#"><img src="/public/icons/logo/YT.png" style="width:25px;height:25px;"></a>
        </div>

        <h4 style="font-size:16px;margin:16px 0 12px;font-weight:bold;">Скачайте приложение</h4>
        <div style="display:flex;gap:10px;">
          <a href="#"><img src="/public/icons/logo/googlePlay.png" style="width:80px;height:auto;"></a>
          <a href="#"><img src="/public/icons/logo/appStore(2).png" style="width:80px;height:auto;"></a>
        </div>
      </div>

    </div>

    <div class="footer-bottom" style="
        border-top:1px solid #ddd;
        margin-top:30px;
        padding-top:16px;
        font-size:13px;
        display:flex;
        justify-content:space-between;
        flex-wrap:wrap;
        color:#777;
    ">
      <p style="margin:0;">2025© ООО «UZUM MARKET». ИНН 309376127. Все права защищены</p>
      <div class="policies">
        <a href="#" style="margin-left:12px;text-decoration:none;color:#777;">Политика конфиденциальности</a>
        <a href="#" style="margin-left:12px;text-decoration:none;color:#777;">Условия использования</a>
        <a href="#" style="margin-left:12px;text-decoration:none;color:#777;">Cookie-политика</a>
      </div>
    </div>

  </div>
</footer>
`