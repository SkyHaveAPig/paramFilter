# paramFilter

paramFilter 是一个用于筛选已选择的条件并以ajax访问后台接口的插件，使用场景：

-  筛选栏


## 使用

```
$(ele).filterData(rules, ajaxItem, callback，params)
```

1. 第一个参数‘rules’是使用者提供的规则，要求值类型为‘对象数组’，对象内分别为一个属性与一个方法：

   1. ‘paramName’是使用者提供的筛选规则名称（在需要此筛选规则的元素中使用），如果名称有相同，后者将会覆盖前者，必填。

   2. ‘processor’（必填）是使用者提供的筛选数据处理方法，默认存在两种筛选规则，可覆盖：

      ```
      [
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
                              startTime: new Date(new Date().getTime() - 86400 * 1000 * 7).format('yyyy-MM-									dd'),
                              endTime: new Date().getTime()
                          }
                          break;

                      case '近30天':
                          return {
                              startTime: new Date(new Date().getTime() - 86400 * 1000 * 30).format('yyyy-MM-									dd'),
                              endTime: new Date().getTime()
                          }
                          break;

                      case '近90天':
                          return {
                              startTime: new Date(new Date().getTime() - 86400 * 1000 * 90).format('yyyy-MM-									dd'),
                              endTime: new Date().getTime()
                          }
                          break;
                  }
              }
          }
      ]
      ```

2. 第二个参数‘ajaxItem’是插件发起ajax请求所需的参数，与jQuery插件的ajax请求参数相同，不需要填写回调方法与请求数据，以下示例：

   ```
   {
       url: './index.php',
       type: 'POST',
       dataType: 'json',
   }
   ```

3. 第三个参数‘callback’（可选）是插件的回调函数，会在每次触发事件时，规则处理全部执行之后执行，函数的第一个参数为筛选后的结果。

4. 第四个参数‘params’（可选）是插件的筛选值，要求值为‘对象数组’，内容可为一条或者多条，填写后将开启初次数据加载，以下是填写格式：

   ```
   单项条件：
   [
       {
           filterType: '状态',
           paramName: 'param-value',
           value: 'error'
       }
   ]

   多项条件：
   [
       {
           filterType: '状态',
           paramName: 'param-value',
           value: 'error'
       },
       {
           filterType: '结果',
           paramName: 'param-value',
           value: 'success'
       },
       {
           filterType: '时间',
           paramName: 'param-date',
           value: '近30天'
       }
   ]
   ```



## 以下实例

```
HTML:
<script type="text/javascript" src="./lib/jquery/jquery.js"></script>
<script type="text/javascript" src="./lib/paramFilter/paramFilter.js"></script>

<div id="example">
    <ul filter-type="status">
        <li param-value="1">123</li>
    </ul>
</div>

JS:
$('#example ul').filterData(
    [		//处理规则
        {
            paramName: 'param-value',
            processor: function(e){
                return e			 //处理方法无返回值将报错
            } 
        }
    ],
    {							   //ajax请求所需参数，填写后回调函数返回后台接口处理后的值
        url: './index.php',
        type: 'POST',
        dataType: 'json'
    }, 
    function(e){					//回调函数，'e'默认为选择的结果与结果所属的元素，当'ajaxItem'参数存在有效数据                                            时，这里的'e'将为请求后台接口筛选后的值与结果所属的元素。
        $('.option').removeClass('param-active')
            for(x in e){
                $(e[x].ele).addClass('param-active')
            }
            console.log(e)
    }, 
    [							   //初次加载筛选所需的值，填写后开启初次加载
        {
            filterType: 'status',
            paramName: 'param-value',
            value: '1'
        },
        {
            filterType: 'type',
            paramName: 'param-value',
            value: '1'
        },
        {
            filterType: 'range',
            paramName: 'param-value',
            value: 'r30'
        }
    ]
)
```

## 函数返回值

```
成功：
{
    errcode: 0, //成功返回 0，未成功则返回	1
    data: {
        status: {
            ele: '<li param-value="1">123</li>',
            value: 1
        }
    }
}

错误：
{
    errcode: 1, 
    data: {
        "状态": '处理器返回值错误'
    }
}
```