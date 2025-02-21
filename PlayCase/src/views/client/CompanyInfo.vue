<template>
  <div class="modal-overlayd" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">&times;</button>
      <div class="modal-scrollable">
        <h1 class="modal-title">Реквизиты ИП Богатырев Тихон Константинович</h1>
        <div class="info-container">
          <p><strong>ОГРНИП:</strong> 317344300073052</p>
          <p><strong>ИНН:</strong> 343534232543</p>
          <p><strong>Адрес:</strong> 142720, МО, г.о. Ленинский, г.Видное, рп Дрожжино, ул. Южная, д.11, к.3, кв.156</p>
          <p><strong>Счет №:</strong> 40802810024820000023</p>
          <p><strong>Наименование банка:</strong> ФИЛИАЛ «ЦЕНТРАЛЬНЫЙ» БАНКА ВТБ (ПАО)</p>
          <p><strong>Корр/счет:</strong> 30101810145250000411</p>
          <p><strong>БИК:</strong> 044525411</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  close: Function,
});
</script>

<style scoped>
.modal-overlayd {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 23px;
  width: 80%;
  max-width: 830px;
  max-height: 261px;
  overflow: hidden;
  position: relative;
  padding: 29px 36px  32px 38px;
}

.modal-scrollable {
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.modal-title {
  text-align: left; 
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.info-container {
  padding: 10px 0;
  text-align: left; 
}

p {
  margin-bottom: 10px;
  font-size: 20px;
  color: #0F1921;
  text-align: left; 
}

.close-button {
  position: absolute;
  top: -15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 75px;
  cursor: pointer;
  font-weight: 200;
}
</style>
