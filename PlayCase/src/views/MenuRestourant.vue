<template>
    <div class="container">
        <h1 class="menu_name">Меню ресторана</h1>
        <div class="menu">
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Все' }" 
                @click="selectCategory('Все')"
            >Все</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 1' }" 
                @click="selectCategory('Категория 1')"
            >Категория 1</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 2' }" 
                @click="selectCategory('Категория 2')"
            >Категория 2</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 3' }" 
                @click="selectCategory('Категория 3')"
            >Категория 3</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 4' }" 
                @click="selectCategory('Категория 4')"
            >Категория 4</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 5' }" 
                @click="selectCategory('Категория 5')"
            >Категория 5</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 6' }" 
                @click="selectCategory('Категория 6')"
            >Категория 6</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 7' }" 
                @click="selectCategory('Категория 7')"
            >Категория 7</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 8' }" 
                @click="selectCategory('Категория 8')"
            >Категория 8</div>
            <div 
                class="category" 
                :class="{ active: selectedCategory === 'Категория 9' }" 
                @click="selectCategory('Категория 9')"
            >Категория 9</div>
        </div>
        <div class="products" ref="productList">
            <ProductCard
                v-for="item in filteredMenuItems"
                :key="item.name"
                :image="item.image"
                :price="item.price"
                :name="item.name"
                :description="item.description"
            />
        </div>
      <img src="../assets/House_01.png" class="house-image" width="80" @click="goToMenuApp" alt="g">
    </div>
</template>

<script>
import meal from '@/assets/meal.png';
import ProductCard from './ProductCard.vue';
import router from "@/router/index.js";
export default {
    components: {
        ProductCard,
    },
    data() {
        return {
            selectedCategory: 'Все',
            menuItems: [
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 1' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 2' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 3' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 1' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 1' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 2' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 2' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 3' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 1' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 1' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 3' 
            },
            {
            image: meal,
            price: '500 ₽',
            name: 'Пицца',
            description: '2 строки',
            category: 'Категория 3' 
            },
            
        ]
        };
    },
    computed: {
        filteredMenuItems() {
            if (this.selectedCategory === 'Все') {
                return this.menuItems;
            }
            return this.menuItems.filter(item => item.category === this.selectedCategory);
        }
    },
    methods: {
        selectCategory(category) {
            this.selectedCategory = category;
        },
        goToMenuApp() {
          router.push({ name: 'MenuApp', params: { teamName: "dada", teamTable: "dadasd"} });
       }
    }
};
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.menu {
    display: flex;
    flex: wrap;
    margin-top: 20px;
    margin-left: 16px;
    width: 95%;
    margin-top: 25px;
    font-family: "Mulish", sans-serif;
    
}

.category {
    background-color: white;
    color: black;
    padding: 10px 17px;
    margin: 0px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.category:hover {
    background-color: #f0f0f0;
}

.active {
    background-color: orange;
    color: white;
}

.menu_name {
    color: white;
    font-family: "Mulish", sans-serif;
    font-size: 40px;
    font-weight: 700;
    margin-top: 30px;
    margin-left: 15px;
}

.products {
    margin-top: 20px;
    margin-left: 5px;
    margin-right: 15px;
    display: grid;
    grid-template-columns: repeat(6, 1fr); 
    gap: 16px;  
}

@media (min-width: 768px) and (max-width: 1024px) {
    .menu {
        flex-direction: row; 
    }
    
    .products {
        grid-template-columns: repeat(3, 1fr); 
        gap: 12px;
    }



    h1 {
        font-size: 32px; 
    }

    .category {
        padding: 10px 5px;
    }
}

</style>