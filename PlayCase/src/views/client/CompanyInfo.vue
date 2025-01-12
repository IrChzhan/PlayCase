<template>
    <div class="company-info-page">
      <div class="h_div">
        <h1>Реквизиты ИП Богатырев Тихон Константинович</h1>
        <!-- <button class="close-button" @click="goBack">&times;</button> -->
      </div>
      <div class="info-container">
          <p><strong>ОГРНИП:</strong> 317344300073052</p>
          <p><strong>ИНН:</strong> 343534232543</p>
          <p><strong>Адрес:</strong> 142720, МО, г.о. Ленинский, г.Видное, рп Дрожжино, ул. Южная, д.11, к.3, кв.156</p>
          <p><strong>Счет №:</strong> 40802810024820000023</p>
          <p><strong>Наименование банка:</strong> ФИЛИАЛ «ЦЕНТРАЛЬНЫЙ» БАНКА ВТБ (ПАО)</p>
          <p><strong>Корр/счет:</strong> 30101810145250000411</p>
          <p><strong>БИК:</strong> 044525411</p>
          <router-link to="/client/menu-app" class="home-button">На главную</router-link>
      </div>
    </div>
  </template>

  <script>
export default {
  name: 'CompanyInfo',
  methods: {
    goBack() {
      this.$router.go(-1); 
    }
  }
};
  </script>

  <style scoped>
  .company-info-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: white;
    color: #3A4C6E;
    font-family: 'Mulish', sans-serif;
  }

  .h_div {
    display: flex;
  }

  .info-container {
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 600px;
      margin: 20px auto;
  }

  h1 {
    margin-bottom: 20px;
      text-align: center;
  }

  p {
    margin-bottom: 10px;
      font-size: 18px;
  }

  .home-button {
      color: #cc9f33;
      text-decoration: none;
      font-size: 18px;
      margin-top: 20px;
      transition: color 0.3s;
  }

  .home-button:hover {
      text-decoration: underline;
      color: #b1882e;
  }

  </style>
