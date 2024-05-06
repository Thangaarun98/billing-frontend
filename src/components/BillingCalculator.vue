<template>
  <div class="billing-calculator col-md-12" style="text-align: left">
    <span class="col-md-4"> </span>
    <span class="col-md-4">
    <h2>Billing Page </h2>
    <form @submit.prevent="calculateBill">
    <div class="form-group">
        <label for="userEmail">User Email:</label>
        <input class="marginLeft" type="email" id="userEmail" v-model="form.userEmail" required>
    </div>
    <div class="form-group">
      <button type="button" @click="addItem">Add Item</button>
    </div>
    <label class="form-group">Bill section</label>
    <div class="form-group mb-2" v-for="(item, index) in form.items" :key="index">
      <input type="text" id="productId" placeholder="Product id" v-model="item.productId" @change="setTotal(index)">
      <input class="marginLeft" @change="setTotal(index)" placeholder="Quantity" type="text" id="quantity" v-model="item.quantity">
      <span class="marginLeft" v-if="item.price !== 0"> <span>&#8377;</span> {{ item.price }}</span>
      <span class="marginLeft text-success" v-if="item.name !== ''"> {{ item.name }}</span>
      <span class="marginLeft text-danger" v-if="productIdError[index]"> {{ productIdError[index] }}</span>
    </div>
    <div class="mt-3 text-danger" v-if="formError !== ''">
        {{ formError }}
    </div>
      <div class="form-group">
      <label> Total Price</label>
       <input type="text" class="marginLeft" id="totalPrice" v-model="form.totalAmount" readonly>
    </div>
    <div class="form-group">
      <label>Denominations:</label>
    </div>
    <div class="form-group mb-2">
      <label>500</label>
      <input type="number" @change="denominations" class="marginLeft" id="500" v-model="form.denominations[500]">
    </div>
    <div class="form-group mb-2">
      <label>100</label>
      <input type="number" @change="denominations" class="marginLeft" id="100" v-model="form.denominations[100]">
    </div>
    <div class="form-group mb-2">
      <label>50</label>
      <input type="number" @change="denominations" class="marginLeft" id="50" v-model="form.denominations[50]">
    </div>
    <div class="form-group mb-2">
      <label>20</label>
      <input type="number" @change="denominations" class="marginLeft" id="20" v-model="form.denominations[20]">
    </div>
    <div class="form-group mb-2">
      <label>10</label>
      <input type="number" @change="denominations" class="marginLeft" id="10" v-model="form.denominations[10]">
    </div>
    <div class="form-group mb-2">
      <label>5</label>
      <input type="number" @change="denominations" class="marginLeft" id="5" v-model="form.denominations[5]">
    </div>
    <div class="form-group mb-2">
      <label>2</label>
      <input type="number" @change="denominations" class="marginLeft" id="2" v-model="form.denominations[2]">
    </div>
    <div class="form-group mb-2">
       <label>1</label>
        <input type="number" @change="denominations" class="marginLeft" id="1" v-model="form.denominations[1]">
    </div>
    <div class="form-group">
      <label> Cash paid by customer</label>
       <input type="text" class="marginLeft" id="totalAmount" v-model="form.paidPayment" readonly>
    </div>
    <div class="mt-3 text-danger" v-if="denominationsError !== ''">
        {{ denominationsError }}
    </div>
      <div class="mt-3">
        <button type="reset" class="bg-danger">Cancel</button>
        <button type="submit" class="bg-success marginLeft">Generate Bill</button>
      </div>
    </form>
    </span>
    <span class="col-md-4"> </span>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: "BillingCalculator.vue",
  data() {
    return {
      form : {
        userEmail: '',
        totalAmount: 0,
        items: [{
          productId: '',
          quantity: '',
          price: 0,
          name : ''
        }
        ],
        denominations: [],
        paidPayment: 0
      },
      productIdError: [],
      formError:'',
      denominationsError: ''
    };
  },
  methods: {
    //Billing submit
    calculateBill() {
      this.formError = '' ;
      //product validations
      if (this.form.totalAmount === 0) {
        this.formError = 'Please get atleast one product';
        return;
      }
      //denominations validations
      this.denominationsError = '';
      if (this.form.paidPayment === 0 || this.form.paidPayment <= this.form.totalAmount) {
        this.denominationsError = 'Please fill the denominations';
        return;
      }
      //billing details post api
      axios.post(process.env.VUE_APP_URL +'api/billingDetails', this.form)
          .then(response => {
            if (response.status) {
              this.$router.push('/receipt/'+response.data.id);
            }

          })
          .catch(error => {
            console.log(error);
          });
    },
    //product add functions
    addItem() {
      this.form.items.push({productId: '', quantity: '', price: 0, name: ''});
    },
    //Product price set
    setTotal(key) {
      let productId = this.form.items[key].productId;
      let quantity = this.form.items[key].quantity;
      let price = 0;
      let total = 0;
      let name = '';
      this.productDetails.forEach(function (product) {
        if (product.product_id == productId) {
          price = product.price * quantity;
          name = product.name;
        }
      });
      this.productIdError[key] = '';
      if (price === 0 && quantity !== '') {
        this.productIdError[key] = 'This product not found'
        return;
      }
      if (isNaN(price)) {
        this.productIdError[key] = 'Only number'
        return;
      }
      this.form.items[key].price = price;
      this.form.items[key].name = name;

      this.form.items.forEach(function (item) {
        total += item.price;
      });
      this.form.totalAmount = total;
    },

    //denominations calculations
    denominations () {
      let value = [500, 100, 50, 20, 10, 5, 2, 1];
      let denominations = 0;
      let formDenominations = this.form.denominations;
      value.forEach(function (val) {
        if (typeof formDenominations[val] !== 'undefined') {
          denominations += formDenominations[val] * val;
        }
      });
      this.form.paidPayment = denominations;
    }

  },
  mounted() {
    //get the product list api
    axios.get(process.env.VUE_APP_URL+'api/products',{
      headers: {
        'Accept' :' application/json'
      }
    }).then(response => {
      this.productDetails = response.data;
    });
  }
}
</script>

<style scoped>
.marginLeft {
  margin-left: 10px;
}
</style>