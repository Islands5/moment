import moment from './moment';

// インスタンスが発行された場合
export const customMoment = (...config) => {
  const patch = {
    apply (target, thisArg, args) {
      // console.log('constructorを呼ぶ')
      const origin = Reflect.apply(...arguments) // moment のインスタンス

      return new Proxy(origin, { // インスタンスに対して proxy を実施
        get(target, prop, receiver) { // target => origin
          const excludeFunction = ['isValid', 'year', 'localeData'] // 実装してない、今の所必要ない関数
          if(typeof target[prop] === 'function' && !excludeFunction.includes(prop)) { // プロパティの呼び出しはメソッド以外も起こるので
            return function() { 
              // console.log('呼び出したメソッド: ' + prop + '--------start')
              // // try {
              // //   //console.log(target.toDate())
              // //   //console.log('呼び出したメソッド: ' + prop)
              // // } catch(e) {
              // //   console.log(e)
              // // }
              // console.log(target[ prop ].apply( this, arguments ))
              // console.log('呼び出したメソッド: ' + prop + '--------end')
              return target[ prop ].apply( this, arguments )
            }
          }
          return Reflect.get(...arguments)
        },
      })
    },
    getPrototypeOf(target) {
      return moment; // instanceofを呼ばれたときにmomentを返すために必要
    },
  }

  const patchedMoment = new Proxy(moment, patch)
  
  return patchedMoment(...config)
}

// クラスメソッド用
[
  'locale',
  'parseZone',
  'deprecationHandler',
  'suppressDeprecationWarnings',
  'utc',
  'defineLocale',
  'relativeTimeThreshold',
  'relativeTimeRounding',
  'invalid',
  'updateLocale',
  'localeData',
  'unix',
  'duration',
  'normalizeUnits',
  'now',
  'max',
  'min',
  'locales',
  'lang',
  'monthsShort',
  'months',
  'isMoment',
  'langData',
  'weekdays',
  'weekdaysShort',
  'isDate',
  'weekdaysMin',
  'isDuration'
].forEach((fn) => {
  customMoment[fn] = (...config) => {
    const patch = {
      apply (target, thisArg, args) {
        const origin = Reflect.apply(...arguments)
        return origin
      }
    }

    const patchedMoment = new Proxy(moment[fn], patch)
    return patchedMoment(...config)
  }
})

customMoment.duration.invalid = (...config) => {
  const patch = {
    apply (target, thisArg, args) {
      const origin = Reflect.apply(...arguments)
      return origin
    }
  }

  const patchedMoment = new Proxy(moment.duration.invalid, patch)
  return patchedMoment(...config)
}

customMoment.HTML5_FMT = {
  DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
  DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
  DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
  DATE: 'YYYY-MM-DD', // <input type="date" />
  TIME: 'HH:mm', // <input type="time" />
  TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
  TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
  WEEK: 'GGGG-[W]WW', // <input type="week" />
  MONTH: 'YYYY-MM', // <input type="month" />
};