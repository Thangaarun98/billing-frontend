<template>
  <div class="billing-calculator col-md-12" style="text-align: left">
    <h2>Receipt Page </h2>
      <div class="form-group">
        <label> Customer Email</label>
        <input type="text" v-model="billingDetails.email" readonly class="marginLeft">
      </div>
      <table class="border-2 mt-5">
        <th class="border-2">Product Id</th>
        <th class="border-2">Product name</th>
        <th class="border-2">Quantity</th>
        <th class="border-2">Purchase Price</th>
        <th class="border-2">Tax % for item</th>
        <th class="border-2">Tax payable for item</th>
        <th class="border-2">Total price of the item</th>
        <tr v-for="(product, index) in productDetails" :key="index" class="border-2">
          <td class="border-2"> {{ product.productId }} </td>
          <td class="border-2"> {{ product.name }} </td>
          <td class="border-2"> {{ product.quantity }} </td>
          <td class="border-2"> {{ product.price.toFixed(2) }} </td>
          <td class="border-2"> {{ product.taxPer }} </td>
          <td class="border-2"> {{ product.tax.toFixed(2) }} </td>
          <td class="border-2"> {{ product.total.toFixed(2) }} </td>
        </tr>
      </table>
      <table>
        <tr>
        <td>Total price without tax :</td>
        <td> {{ billingDetails.total_price.toFixed(2) }} </td>
        </tr>
        <tr>
          <td>Total tax payable :</td>
          <td> {{ billingDetails.total_tax.toFixed(2) }} </td>
        </tr>
        <tr>
          <td>Net price of the purchased item :</td>
          <td> {{ billingDetails.total_amount.toFixed(2) }} </td>
        </tr>
        <tr>
          <td>Rounded down value of the purchased items net price :</td>
          <td> {{ billingDetails.total_amount.toFixed(0) }}.00 </td>
        </tr>
        <tr>
          <td>Balanced payable to the customer :</td>
          <td> {{ billingDetails.balance_amount.toFixed(0) }}.00 </td>
        </tr>
      </table>
    <div style="border-top: 2px solid #000;"></div>
    <h3>Balance Denomination</h3>
    <table>
      <tr>
        <td>500 :</td>
        <td> {{ balanceDenominations[500] }} </td>
      </tr>
      <tr>
        <td>100 :</td>
        <td> {{ balanceDenominations[100] }} </td>
      </tr>
      <tr>
        <td>50 :</td>
        <td> {{ balanceDenominations[50] }} </td>
      </tr>
      <tr>
        <td>20 :</td>
        <td> {{ balanceDenominations[20] }} </td>
      </tr>
      <tr>
        <td>10 :</td>
        <td> {{ balanceDenominations[10] }} </td>
      </tr>
      <tr>
        <td>5 :</td>
        <td> {{ balanceDenominations[5] }} </td>
      </tr>
      <tr>
        <td>2 :</td>
        <td> {{ balanceDenominations[2] }} </td>
      </tr>
      <tr>
        <td>1 :</td>
        <td> {{ balanceDenominations[1] }} </td>
      </tr>

    </table>
    <button type="button" class="bg-success" @click="newBill()">New Bill</button>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: "receiptPage",
  props: {
    billingId: String
  },
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
      denominationsError: '',
      billingDetails : {},
      productDetails : {},
      balanceDenominations : {}
    };
  },
  methods: {
    // Billing page route
    newBill() {
      this.$router.push('/');
    }
  },
  mounted() {
    // Billing details get api
    axios.get(process.env.VUE_APP_URL+'api/billingDetails/'+this.billingId,{
      headers: {
        'Accept' :' application/json'
      }
    }).then(response => {
      if (response.status) {
        this.billingDetails = response.data;
        this.productDetails = response.data.product_details;
        this.balanceDenominations = response.data.balance_denomination;
      }
    });
  }
}
</script>

<style scoped>
.marginLeft {
  margin-left: 10px;
}
</style>