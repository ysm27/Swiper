class Swiper {
  constructor(props){
    this.data = {
      id: props.id,
      index: props.index,
      duration: props.duration,
      _isLock: false,
      _itemWidth: null,
      _defaultLength: null,
      _translateX: 0,
    }
    this._init();
  }
  _init(){
    this._bind();
    this.clone();
  }
  _bind(){
    let swiperPrev = $(`#${this.data.id} #swiper-prev`);
    let swiperNext = $(`#${this.data.id} #swiper-next`);
    swiperPrev.on('click',this.goPre.bind(this));
    swiperNext.on('click',this.goNext.bind(this));
    let swiperSwitch = $(`#${this.data.id} .swiper-pagination-switch`);
    for(let i = 0; i < swiperSwitch.length; i++){
      swiperSwitch[i].setAttribute('data-index',i);
      swiperSwitch[i].addEventListener('click',this.swiperSwitch.bind(this));
    }
    window.addEventListener('resize',this.swiperResert.bind(this));
  }
  swiperResert(){
    let swiperList = document.querySelector(`#${this.data.id} .swiper-list`);
    let itemWidth = swiperList.offsetWidth;
    let index = this.data.index;
    let translateX = -(itemWidth + itemWidth * index);
    this.data._translateX = translateX;
    this.data._itemWidth = itemWidth;
    swiperList.style.transform = `translateX(${translateX}px)`;    
  }
  clone(){
    let swiperItem = $(`#${this.data.id}`).find('.swiper-item');
    let defaultLength = swiperItem.length;
    let firstItem = swiperItem[0].cloneNode();
    let lastItem = swiperItem[ defaultLength - 1].cloneNode();
    let itemWidth = swiperItem.get(0).offsetWidth;
    let index = this.data.index;
    let translateX = -(itemWidth + itemWidth * index);
    this.data._translateX = translateX;
    this.data._itemWidth = itemWidth;
    this.data._defaultLength = defaultLength; 
    let swiperList = document.querySelector(`#${this.data.id} .swiper-list`);
    swiperList.appendChild(firstItem);
    swiperList.prepend(lastItem);
    this.goIndex(index);
  }
  goIndex(index){
    let duration = this.data.duration;
    let itemWidth = this.data._itemWidth;
    let translateX = this.data._translateX;
    let defaultLength = this.data._defaultLength;
    let endTranslateX = -(itemWidth + itemWidth  * index);
    let swiperList = document.querySelector(`#${this.data.id} .swiper-list`);
    let isLock = this.data._isLock;
    if(isLock){
      return
    }
    this.data._isLock = true;
    let that = this;
    this.animateTo(translateX,endTranslateX,duration,function(value){
      swiperList.style.transform = `translateX(${value}px)`;
    },function(value){
      if(index === -1){
        index = defaultLength - 1;
        value = -(itemWidth + itemWidth  * index);
      }
      if(index === defaultLength){
        index = 0;
        value = -(itemWidth + itemWidth  * index);
      }
      swiperList.style.transform = `translateX(${value}px)`;
      that.data.index = index;
      that.data._translateX = value;
      that.data._isLock = false;
      that.hightLight(index);
    })
  }
  goPre(){
    let index = this.data.index;
    this.goIndex(index - 1);
  }
  goNext(){
    let index = this.data.index;
    this.goIndex(index + 1);
  }
  swiperSwitch(e){
    let index =e.target.dataset.index;
    index = Number(index);
    this.goIndex(index);
  }
  hightLight(index){
    let swiperSwitch = $(`#${this.data.id} .swiper-pagination-switch`);
    for(let i = 0; i < swiperSwitch.length; i++){
      swiperSwitch[i].className = 'swiper-pagination-switch';
    }
    swiperSwitch[index].className = 'swiper-pagination-switch active';
  }
  animateTo(begin,end,duration,changeCallback,finishCallback){
    let statTime = Date.now();
    let that = this;
    requestAnimationFrame( function uptate() {
      let dateNow = Date.now();
      let time = dateNow - statTime;
      let value = that.linear(time,begin,end,duration);
      typeof changeCallback === 'function' && changeCallback(value);
      if(statTime + duration > dateNow){
        requestAnimationFrame(uptate)
      }else{
        typeof finishCallback === 'function' && finishCallback(end);
      }
    })
  }
  linear(time,begin,end,duration){
    return (end - begin) * time / duration + begin;
  }
}
const PAGE = {
  data: {
    swiperWrapper_1: null,
    swiperWrapper_2: null,
  },
  init: function(){
    this.initSwiper();
  },
  initSwiper: function(){
    PAGE.data.swiperWrapper_1 = new Swiper ({
      id: 'swiper-wrapper_1',
      index: 2,
      duration: 500
    });
    PAGE.data.swiperWrapper_2 = new Swiper ({
      id: 'swiper-wrapper_2',
      index: 0,
      duration: 1500
    });
  }
}
PAGE.init();