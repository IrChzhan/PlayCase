<template>
    <div class="modal-overlay" v-if="show" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">&times;</button>
        <div class="modal-body">
          <div class="form-section">
            <div class="team-title">Название команды</div>
            <h1 class="title">Выберите количество игроков, за которых будете оплачивать</h1>
  
            <div class="player-buttons">
              <button
                v-for="number in 12"
                :key="number"
                :class="['player-button', { active: selectedPlayers === number }]"
                @click="selectPlayers(number)"
              >
                {{ number }}
              </button>
            </div>
  
            <div class="price-info">
              <div class="total-price">{{ totalPrice }} ₽ <span>к оплате</span></div>
              <div class="price-per-player">{{ pricePerPlayer }} ₽ <span>цена за 1 человека</span></div>
            </div>
  
            <div class="form">
              <p>Напишите вашу почту, на которую вы хотите, чтобы пришел чек</p>
              <input type="email" placeholder="Ваша электронная почта" class="email-input" />
              <input type="text" placeholder="Введите промокод" class="promo-input" />
              <button class="pay-button">Перейти к оплате</button>
              <div class="policy">
                <input type="checkbox" id="policy-checkbox" />
                <label for="policy-checkbox">
                  Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>  

<script setup>
import { ref, computed } from 'vue';
defineProps({
  show: Boolean,
  closeModal: Function
});

const selectedPlayers = ref(1); // По умолчанию выбран 1 игрок
const pricePerPlayer = ref(700); // Стоимость одного игрока

// Вычисляемая общая сумма
const totalPrice = computed(() => selectedPlayers.value * pricePerPlayer.value);

// Метод для выбора количества игроков
function selectPlayers(number) {
  selectedPlayers.value = number;
}

</script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: var(--c-white, #fff);
    border-radius: 1vw;
    padding: clamp(30px, 4vw, 50px) clamp(20px, 8vw, 100px);
    width: 70vw;
    max-width: 900px;
    position: relative;
    font-family: "Mulish", sans-serif;
  }
  
  .close-button {
    position: absolute;
    top: 2%;
    right: 2%;
    background: none;
    border: none;
    font-size: clamp(16px, 2vw, 24px);
    font-weight: bold;
    color: #0F1921;
    cursor: pointer;
  }
  
  .main-heading {
    font-size: clamp(24px, 4vw, 36px);
    color: #0F1921;
    margin-bottom: 2vw;
    line-height: 1.2;
    font-weight: 700;
  }
  
  .team-title {
    display: inline-block;
    font-size: clamp(14px, 1.5vw, 18px);
    font-weight: bold;
    color: #CC9F33;
    padding: 1vw 2vw;
    border: 1px solid rgba(15, 25, 33, 0.4);
    border-radius: 12px;
    margin-bottom: 1vw;
  }


  .price-info {
  margin-bottom: 30px;
  font-size: 1.2rem;
}

.price-info .total-price,
.price-info .price-per-player {
  font-weight: 700;
  color: #333;
}

.price-info span {
  font-weight: 400;
  color: #555;
}

.form p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

.email-input,
.promo-input {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.pay-button {
  background-color: #cc9f33;
  color: #fff;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.pay-button:hover {
  background-color: #b1882e;
}

.policy {
  font-size: 0.8rem;
  color: #777;
  text-align: left;
}

.policy input {
  margin-right: 5px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.player-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  margin-right: 160px;
}

.player-button {
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.player-button.active {
  background-color: #cc9f33;
  color: #fff;
  border-color: #cc9f33;
}
  
  @media (max-width: 768px) {
    @media (max-width: 768px) {
    .modal-content {
      width: 90vw;
      padding: 15px;
    }
    .main-heading {
      font-size: clamp(18px, 3vw, 24px);
    }
    .team-title {
      font-size: clamp(10px, 1.5vw, 14px);
      padding: 0.5vw 1vw;
    }
    .textarea {
      height: 100px;
      font-size: clamp(10px, 1.5vw, 12px);
    }
    .checkbox-title {
      font-size: clamp(10px, 1.5vw, 14px);
    }
    .checkbox-container {
      font-size: clamp(10px, 1.5vw, 12px);
    }
    .submit-button {
      font-size: clamp(10px, 1.5vw, 12px);
      padding: 0.8vw 1.5vw;
    }
    .checkbox-groups {
      flex-direction: column;
    }
  }
  }
  </style>
  