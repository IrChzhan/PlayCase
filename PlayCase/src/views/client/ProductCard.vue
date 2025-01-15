<template>
  <div class="product-card">
    <img :src="image" class="product-image" />
    <p class="product-price">{{ price }}</p>
    <h3 class="product-name">{{ name }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.product-card {
  padding: 10px;
  text-align: center;
  font-family: 'Mulish', sans-serif;
}

.product-image {
  max-width: 100%;
  height: auto;
}

.product-price {
  font-weight: bold;
  color: #fffffc;
  margin-top: 8px;
  font-size: 25px;
  margin-right: 90px;
}

.product-name {
  margin-right: 105px;
  margin-top: 5px;
  color: #fffffc;
}

.product-description {
  color: #fffffc;
  margin-right: 90px;
}
</style>
