;(function(factory){
	if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define([ "jquery" ],factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        //Browser globals
        factory(jQuery);
    }
})(function($){

	new Date().__proto__.format = function(formatStr){
	    var str = formatStr;   
	    var Week = ['日','一','二','三','四','五','六'];  
	  
	    str=str.replace(/yyyy|YYYY/,this.getFullYear());   
	    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));   
	  
	    str=str.replace(/MM/,(this.getMonth()+1)>9?this.getMonth().toString():'0' + (this.getMonth()+1));   
	    str=str.replace(/M/g,(this.getMonth()+1)); 
	  
	    str=str.replace(/w|W/g,Week[this.getDay()]);   
	  
	    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
	    str=str.replace(/d|D/g,this.getDate());   
	  
	    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());   
	    str=str.replace(/h|H/g,this.getHours());   
	    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());   
	    str=str.replace(/m/g,this.getMinutes());   
	  
	    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());   
	    str=str.replace(/s|S/g,this.getSeconds());   
	  
	    return str;   
	}

	var defaults = [
		{
			paramName: 'param-value',
			processor: function(e){
				return e
			}
		},
		{
			paramName: 'param-date',
			processor: function(e){
				switch(e) {
					case '近7天':
						return {
							startTime: new Date(new Date().getTime() - 86400 * 1000 * 7).format('yyyy-MM-dd'),
							endTime: new Date().format('yyyy-MM-dd')
						}
						break;

					case '近30天':
						return {
							startTime: new Date(new Date().getTime() - 86400 * 1000 * 30).format('yyyy-MM-dd'),
							endTime: new Date().format('yyyy-MM-dd')
						}
						break;

					case '近90天':
						return {
							startTime: new Date(new Date().getTime() - 86400 * 1000 * 90).format('yyyy-MM-dd'),
							endTime: new Date().format('yyyy-MM-dd')
						}
						break;
				}
			}
		}
	]

	function paramFilter(rules, ajaxItem, callback, _this, params){

		this.init = function(){
			var _filter = this
			this.result = {
				err_msg: '',
				data: {}
			}
			this.quene = defaults
			this.addRule(rules, _filter)
			this.callback = callback || function(){}
			this.ajaxItem = ajaxItem
			this.params = params || ''
			this.filter(_filter)
			if(this.params){
				this.load(_filter)
			}
		}

		this.addRule = function(r, _filter){
			if(typeof r == 'object'){
				r.forEach(function(obj){
					if(obj.paramName && typeof obj.processor == 'function'){
						_filter.quene.forEach(function(e, i){
							if(e.paramName == obj.paramName){
								_filter.quene[i] = obj
							}else{
								_filter.quene.push(e)
							}
						})
					}
				})
			}
		}

		this.load = function(_filter){
			if(typeof _filter.params == 'object'){
				_filter.quene.forEach(function(obj, index){
					_filter.params.forEach(function(param){
						if(param.paramName == obj.paramName){
							_this.find('*').each(function(i, ele){
								var filterType = $(ele).parent().attr('filter-type')
								$(ele).find('*').each(function(){
									if(param.filterType == filterType && param.value == $(this).attr(param.paramName)){
										_filter.result.data[filterType] = {}
										_filter.result.data[filterType].value = _filter.quene[index].processor($(this).attr(obj.paramName))
										_filter.result.data[filterType].ele = this
										if(_filter.result.data[filterType].value){
											_filter.result.err_msg = 0
										}else{
											_filter.result.err_msg = 1
											_filter.result.data[filterType] = '处理器返回值错误'
										}
									}
								})
							})
						}
					})
				})
				if(_filter.ajaxItem){
					_filter.ajax(_filter)
				}else{
					_filter.callback(_filter.result)
				}
			}
		}

		this.filter = function(_filter){
			_this.each(function(i, ele){
				var filterType = $(ele).attr('filter-type')
				if(filterType){
					_filter.quene.forEach(function(obj, i){
						$(ele).find('*[' + obj.paramName + ']').click(function(e){
							_filter.result.data[filterType] = {}
							_filter.result.data[filterType].value = _filter.quene[i].processor($(this).attr(obj.paramName))
							_filter.result.data[filterType].ele = this
							if(_filter.result.data[filterType]){
								_filter.result.err_msg = 0
							}else{
								_filter.result.err_msg = 1
								_filter.result.data[filterType] = '处理器返回值错误'
							}

							if(_filter.ajaxItem){
								_filter.ajax(_filter)
							}else{
								_filter.callback(_filter.result)
							}
						})
					})	
				}
			})
		}

		this.ajax = function(_filter){
			_filter.ajaxItem.data = {}
			for(x in _filter.result.data){
				_filter.ajaxItem.data[x] = _filter.result.data[x].value
			}

			_filter.ajaxItem.success = function(ret){
				var t = ''
				for(x in _filter.result.data){
					t = ret.data[x]
					ret.data[x] = {}
					ret.data[x].value = t
					ret.data[x].ele = _filter.result.data[x].ele
				}
				_filter.callback(ret.data)
			}

			_filter.ajaxItem.error = function(e){
				console.log('ajax请求错误：' + e.err_msg)
			}

			$.ajax(_filter.ajaxItem)
		}

		this.init()
	}

	$.fn.paramFilter = function(rules, ajaxItem, callback, params){
		var filter = new paramFilter(rules, ajaxItem, callback, this, params)
		return this
	}
})