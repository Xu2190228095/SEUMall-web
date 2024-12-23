<template>
    <div class="NumberInput">
      <span @click="minus" :class="['minus',{ban:num<=min}]">-</span><input v-model="num" type="number" :min="min" :max="max" /><span @click="add" :class="['add',{ban:num>=max}]">+</span>
    </div>
</template>

<script>
export default {
  name: 'NumberInput',
  props:{
    min:{
      type:Number,
      default:0
    },
    max:{
      type:Number,
      default:1
    },
    initNum:{
      type:Number,
      default:1
    }
  },
  data(){
    return{
      num:this.initNum || this.min
    }
  },
  methods:{
    minus(){
      if(this.num<=this.min){
        return;
      }
      this.num = Number(this.num)-1;
    },
    add(){
      if(this.num>=this.max){
        return;
      }
      this.num = Number(this.num)+1;
    },
  },
  watch:{
    num(newNum,oldNum){
      this.$emit('input',Number(newNum));
      this.$emit('changeHandle');
    },
    initNum(newVal){
      if(newVal!==''){
        this.num = newVal;
      }
    }
  }
}
</script>

<style scoped>
.NumberInput{
  border: 1px solid #000000;
  width: 135px;
  height: 35px;
  user-select: none;
  span{
    display: inline-block;
    vertical-align: top;
    width: 34px;
    height: 35px;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    color:#6170fb;
    font-size: 26px;
  }
  input{
    border: none;
    display: inline-block;
    vertical-align: top;
    width: 65px;
    height: 33px;
    text-align: center;
    border-left: 1px solid #6170fb;
    border-right: 1px solid #6170fb;
  }
  .ban{
    cursor: not-allowed;
  }
}
</style>