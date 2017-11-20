<template>
  <el-container class="wrapper">
    <el-header
      height="60px"
      :style="{ 'background-color': primaryColor }">
      <img
        src="./assets/hj2z-logo.svg"
        alt="hj2z-logo"
        class="header-logo">
     <ul class="header-operations" ref="page">
      <li>
          <span
            @click="search('categorykeywords','',1)"
            :class="{ 'is-active': query.routeName.indexOf('category') >=0 }"
            class="header-lang">
            分类
          </span>
          <span>/</span>
          <span
            @click="search('bookkeywords','',1)"
            :class="{ 'is-active': query.routeName.indexOf('book') >=0 }"
            class="header-lang">
            图书
          </span>
        </li>
      </ul>
      <ul class="header-operations hidden-sm-and-down">
        <li @click="showThemeDialog">{{ langConfig.header.switch[lang] }}</li>
        <li
          class="header-download"
          :class="{ 'is-available': canDownload }"
          @click="downloadZip">
          {{ langConfig.header.download[lang] }}
        </li>
        <li @click="showHelpDialog">{{ langConfig.header.help[lang] }}</li>
        <li>
          <span
            @click="switchLang('zh-CN')"
            :class="{ 'is-active': lang === 'zh-CN' }"
            class="header-lang">
            中文
          </span>
          <span>/</span>
          <span
            @click="switchLang('en-US')"
            :class="{ 'is-active': lang === 'en-US' }"
            class="header-lang">
            En
          </span>
        </li>
      </ul>
    </el-header>
    <el-container>
      <el-main class="content">
       <el-breadcrumb>
       <el-breadcrumb-item :to="{name: 'categoryno', query: {key:'', pageno: 1}}">{{ langConfig.breadcrumb.main['Category'][lang]}}</el-breadcrumb-item>
       <template v-for="item in breadcrumbs">
         <el-breadcrumb-item :to="{name: query.routeName,query: {key: item.no, pageno: 1}}">{{ item.name }}</el-breadcrumb-item>
       </template>
      </el-breadcrumb>
        <el-form inline :model="query" label-position="right" label-width="60px" class="query-form">
          <el-form-item>
            <el-input v-model="query.key" :placeholder="query.inputHolder" @keyup.native.enter="search('',query.key,1)"></el-input>
          </el-form-item>
          <el-form-item>
           <el-select v-model="query.type" multiple :placeholder="query.typeHolder">
            <el-option
              v-for="item in query.options"
              :key="item"
              :label="langConfig.table[query.className][item][lang]"
              :value="item">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search('',query.key,1)">{{ langConfig.query.search[lang] }}</el-button>
          </el-form-item>
        </el-form>
         <el-button-group>
          <el-button type="primary" icon="el-icon-arrow-left" @click="changePage(-1)" :disabled="query.pageno<=1">{{ langConfig.table['pre'][lang] }}</el-button>
          <el-button type="primary" @click="changePage(1)" :disabled="girdData.length < pageSize">{{ langConfig.table['next'][lang] }}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
        <el-table :data="girdData" class="table" stripe>
          <!--<el-table-column type="index"></el-table-column>-->
          <template v-for="item in query.options">
            <template v-if="item=='name'">
              <template v-if="query.routeName.indexOf('book') >=0">
                <el-table-column :prop="item" :label="langConfig.table[query.className][item][lang]" :key="query.routeName+item" min-width="100">
                 <template slot-scope="scope">
                  <el-popover placement="bottom" @show="getSummary(scope.row)" @hide="initbookInfo()" title="基本信息">
                    <p style="text-align:center;" v-html="bookInfo.image"></p>
                    <p>简介：{{ bookInfo.summary }}</p>
                    <p>页数：{{ bookInfo.pages }} , 价格：{{ scope.row.price }} 元</p>
                    <p>馆藏地：{{scope.row.no.split('/')[0]>='I25'?'二楼西室':'二楼东室'}}</p>
                    <p style="text-align:center;"><el-button type="danger" round @click.native.prevent="$refs.page.click()">关闭</el-button></p>
                    <div slot="reference" class="name-wrapper" style="color: #409EFF; cursor: pointer;">
                      {{ scope.row.name }}({{ scope.row.num }}本)
                    </div>
                  </el-popover>
                </template>
               </el-table-column>
              </template>
              <template v-else>
                <el-table-column :prop="item" :label="langConfig.table[query.className][item][lang]" :key="query.routeName+item" min-width="100">
                 <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper" :style="scope.row.path.indexOf(';',scope.row.path.length-1)!=-1?'color: #409EFF; cursor: pointer;':''"  @click="scope.row.path.indexOf(';',scope.row.path.length-1)!=-1?search('categoryno',scope.row.no,1):''">
                      {{ scope.row.name }}
                  </div>
                </template>
               </el-table-column>
              </template>
               
            </template>
            <template v-else>
              <el-table-column :prop="item" :label="langConfig.table[query.className][item][lang]" :key="query.routeName+item" v-if="item!='isbn'" :min-width="item=='no'?60:100"></el-table-column>
            </template>
          </template>
          <el-table-column v-if="query.className=='Category'" :label="langConfig.table[query.className]['operations'][lang]" min-width="50">
            <template slot-scope="scope">
              <!--<el-button size="mini" type="primary" icon="el-icon-zoom-in" @click="search('categoryno',scope.row.no,1)" :disabled="scope.row.path.indexOf(';',scope.row.path.length-1)==-1"></el-button>-->
              <el-button size="mini" type="primary" icon="el-icon-search" @click="searchBooks('bookkeywords',scope.row.no)"></el-button>
            </template>
         </el-table-column>
      </el-table>
      <el-button-group>
          <el-button type="primary" icon="el-icon-arrow-left" @click="changePage(-1)" :disabled="query.pageno<=1">{{ langConfig.table['pre'][lang] }}</el-button>
          <el-button type="primary" @click="changePage(1)" :disabled="girdData.length < pageSize">{{ langConfig.table['next'][lang] }}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
      </el-main>
    </el-container>
    <el-dialog
      center
      :visible.sync="themeDialogVisible"
      :title="langConfig.header.switch[lang]"
      width="400px">
      <el-form
        :model="colors"
        :rules="rules"
        ref="form"
        class="theme-form"
        label-position="top"
        label-width="70px">
        <el-form-item :label="langConfig.form.theme[lang]" prop="primary">
          <el-color-picker v-model="colors.primary" ></el-color-picker>
        </el-form-item>
        <el-form-item class="color-buttons">
          <el-button type="primary" @click="submitForm">{{ langConfig.form.switch[lang] }}</el-button>
          <el-button @click="resetForm">{{ langConfig.form.reset[lang] }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="helpDialogVisible" :title="langConfig.help.title[lang]">
      <div v-html="langConfig.help.content[lang]" class="help"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="helpDialogVisible = false">{{ langConfig.help.ok[lang] }}</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
  import generateColors from './utils/color'
  import objectAssign from 'object-assign'
  import blobUtil from 'blob-util'
  import langConfig from './lang'
  import tableData from './table-data'
  import JSZip from 'jszip'
  import FileSaver from 'file-saver'
  import search from './services/search'
  import 'element-ui/lib/theme-chalk/display.css'
  import { Loading } from 'element-ui';
  
  export default {
    name: 'app',
    data () {
      const colorValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.langConfig.validate.required[this.lang]))
        } else if (!/^#[\dabcdef]{6}$/i.test(value)) {
          return callback(new Error(this.langConfig.validate.format[this.lang]))
        } else {
          callback()
        }
      }
      return {
        colors: {
          primary: '#409eff'
        },
        rules: {
          primary: [
            { validator: colorValidator, trigger: 'blur' }
          ]
        },
        originalStylesheetCount: -1,
        originalStyle: '',
        langConfig,
        tableData,
        primaryColor: '#409eff',
        themeDialogVisible: false,
        helpDialogVisible: false,
        zip: null,
        styleFiles: [],
        fontFiles: ['element-icons.ttf', 'element-icons.woff'],
        fonts: [],
        canDownload: false,
        breadcrumbs: [],
        query: {
          fields:['no','name','path'],
          className:'Category',
          routeName: this.$route.name,
          key: '',
          pageno: 1,
          inputHolder: langConfig.query.cat.inputHolder[this.lang],
          type: ['no','name'],
          typeHolder: langConfig.query.cat.typeHolder[this.lang],
          options: ['no','name']
        },
        girdData: [],
        pageSize: search.pageSize,
        bookInfo:{
          image: '<i class="el-icon-loading"></i>',
          summary: '暂无信息',
          pages: '无'
        }
      }
    },

    computed: {
      lang () {
        let langs = ['zh-CN', 'en-US']
        for (var i = 0; i < langs.length; i++) {
          if (this.$route.path.indexOf(langs[i]) >= 0) return langs[i]
        }
        return 'zh-CN'
      }
    },

    methods: {
      switchLang (lang) {
        this.$router.push({name: this.query.routeName,params: {'lang': lang}})
      },

      showThemeDialog () {
        this.themeDialogVisible = true
      },

      showHelpDialog () {
        this.helpDialogVisible = true
      },

      resetZip () {
        this.zip = new JSZip()
        this.fonts.forEach((font, index) => {
          console.log(font, index)
          this.zip.file(`fonts/${this.fontFiles[index]}`, font.data)
        })
      },

      writeNewStyle () {
        let cssText = this.originalStyle
        Object.keys(this.colors).forEach(key => {
          cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key])
        })

        if (this.originalStylesheetCount === document.styleSheets.length) {
          const style = document.createElement('style')
          style.innerText = cssText
          document.head.appendChild(style)
        } else {
          document.head.lastChild.innerText = cssText
        }
      },

      submitForm () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.themeDialogVisible = false
            this.primaryColor = this.colors.primary
            this.colors = objectAssign({}, this.colors, generateColors(this.colors.primary))

            this.canDownload = true
            this.writeNewStyle()
          } else {
            return false
          }
        })
      },

      downloadZip () {
        if (!this.canDownload) return
        this.resetZip()
        this.styleFiles.forEach(file => {
          let cssText = file.data
          Object.keys(this.colors).forEach(key => {
            cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key])
          })
          const css = blobUtil.createBlob([cssText], { type: 'text/css' })
          this.zip.file(file.name, css)
        })
        this.zip.generateAsync({ type: 'blob' })
          .then(blob => {
            FileSaver.saveAs(blob, `element-${this.primaryColor}.zip`)
          })
      },

      resetForm () {
        this.$refs.form.resetFields()
      },

      getStyleTemplate (data) {
        const colorMap = {
          '#409eff': 'primary',
          '#53a8ff': 'light-1',
          '#66b1ff': 'light-2',
          '#79bbff': 'light-3',
          '#8cc5ff': 'light-4',
          '#a0cfff': 'light-5',
          '#b3d8ff': 'light-6',
          '#c6e2ff': 'light-7',
          '#d9ecff': 'light-8',
          '#ecf5ff': 'light-9'
        }
        Object.keys(colorMap).forEach(key => {
          const value = colorMap[key]
          data = data.replace(new RegExp(key, 'ig'), value)
        })
        return data
      },

      getFile (url, isBlob = false) {
        return new Promise((resolve, reject) => {
          const client = new XMLHttpRequest()
          client.responseType = isBlob ? 'blob' : ''
          client.onreadystatechange = () => {
            if (client.readyState !== 4) {
              return
            }
            if (client.status === 200) {
              const urlArr = client.responseURL.split('/')
              resolve({
                data: client.response,
                url: urlArr[urlArr.length - 1]
              })
            } else {
              reject(new Error(client.statusText))
            }
          }
          client.open('GET', url)
          client.send()
        })
      },

      getIndexStyle () {
        this.getFile('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
          .then(({ data }) => {
            this.originalStyle = this.getStyleTemplate(data)
          })
      },

      getSeparatedStyles () {
        this.getFile('https://unpkg.com/element-ui/lib/theme-chalk/')
          .then(({ data }) => {
            return data.match(/href="[\w-]+\.css"/g).map(str => str.split('"')[1])
          })
          .then(styleFiles => {
            return Promise.all(styleFiles.map(file => {
              return this.getFile(`https://unpkg.com/element-ui/lib/theme-chalk/${file}`)
            }))
          })
          .then(files => {
            this.styleFiles = files.map(file => {
              return {
                name: file.url,
                data: this.getStyleTemplate(file.data)
              }
            })
          })
      },

      getFontFiles () {
        Promise.all(this.fontFiles.map(font => {
          return this.getFile(`https://unpkg.com/element-ui/lib/theme-chalk/fonts/${font}`, true)
        }))
          .then(fonts => {
            this.fonts = fonts
          })
      },
      
      initGirdData () {
        let to=this.$route
        let key=to.query['key'] ? to.query['key'].toUpperCase() : ''
        let pageno=isNaN(to.query['pageno']) ? 1 : parseInt(to.query['pageno'])
        this.query={
          fields:['no','name','path'],
          className:'Category',
          routeName: to.name,
          key: key,
          pageno: pageno,
          inputHolder: this.langConfig.query.cat.inputHolder[this.lang],
          type: this.query.type,
          typeHolder: this.langConfig.query.cat.typeHolder[this.lang],
          options: ['no','name']
        }
        
        if(to.name.indexOf('book') >= 0) {
          this.query.fields = ['id','no','name','author','isbn', 'num', 'price', 'summary', 'image','pageNum']
          this.query.className = 'Book',
          this.query.routeName = to.name
          this.query.inputHolder=this.langConfig.query.book.inputHolder[this.lang]
          this.query.typeHolder=this.langConfig.query.book.typeHolder[this.lang]
          this.query.options=['no','name','author','isbn']
          let that=this
          let loadingInstance = Loading.service({ fullscreen: true })
          let callback = function(data) {
              that.girdData = data
              loadingInstance.close()
            }
            search.getBooks(to.name, key, this.query.fields, this.query.type, pageno, callback)
        }else {
          if(key == ''){
            this.breadcrumbs = []
            this.girdData = this.tableData['zh-CN']
          }else{
            let loadingInstance = Loading.service({ fullscreen: true })
            let that=this
            let callback = function(data) {
              that.girdData = data
              if(data.length>0 && to.name=='categoryno'){
                that.breadcrumbs = []
                let parents= data[0].path.split(';')
                for (let i=0; i < parents.length-1; i++) {
                  if(parents[i].indexOf(':')>0) {
                    that.breadcrumbs.push({'no': parents[i].split(':')[0], 'name': parents[i].split(':')[1]})
                    if(key == parents[i].split(':')[0]) break
                  }
                }
              } 
             loadingInstance.close()
            }
            search.getCategories(to.name, key, this.query.fields , this.query.type, pageno, callback)
          }
        }
        
      },
      
      search(routeName, key, pageno) {
        if(routeName == '') routeName=this.query.routeName
        this.toRoute(routeName, key, pageno)
      },
      searchBooks(routeName,key){
        this.query.type=["no"]
        this.toRoute(routeName, key, 1)
      },
      changePage(no) {
        this.toRoute(this.query.routeName, this.query.key, this.query.pageno+no)
      },
      toRoute(routeName,key,pageno) {
        this.$router.push({name: routeName, query: {key:key, pageno: pageno, type: this.query.type.toString()}})
      },
      getSummary(row){
        let that=this
        let callback=function(bookInfo){
          if(bookInfo == null){
            that.bookInfo.image='<i class="el-icon-warning"></i>'
            that.bookInfo.summary='暂无信息'
            that.bookInfo.pages='无'
          }else{
            that.bookInfo.image='<img src="'+bookInfo.image+'">'
            that.bookInfo.summary=bookInfo.summary
            that.bookInfo.pages=bookInfo.pages
            if(bookInfo.summary!=''){
              let book={
                'image': bookInfo.image,
                'summary': bookInfo.summary
              }
              if(row.pageNum.length<=2 && bookInfo.pages.length>2){
                book['pageNum']=bookInfo.pages
              }
              let callback=function(data){
                //console.log(data)
              }
              search.saveBook(row.id,book,callback)
            }
          }
        }
        if(typeof(row.summary)=='undefined' || row.summary==''){
            search.getDoubanInfo(row.isbn,callback)
        }else{
            that.bookInfo.image='<img src="'+row.image+'">'
            that.bookInfo.summary=row.summary
            that.bookInfo.pages=row.pageNum
        }
        
      },
      initbookInfo() {
        this.bookInfo={
          image: '<i class="el-icon-loading"></i>',
          summary: '暂无信息',
          pages: '无'
        }
      }
    },
    
    created () {
      this.getIndexStyle()
      this.getSeparatedStyles()
      this.getFontFiles()
      this.initGirdData()
    },

    mounted () {
      this.$nextTick(() => {
        this.originalStylesheetCount = document.styleSheets.length
      })
    },
    watch: {
      '$route' (to, from) {
        this.initGirdData()
        if(to.name.indexOf('book') >= 0) {
          this.query.type = to.name == from.name && this.query.type.length != 0 ? this.query.type : ['no']
        }else if(to.name.indexOf('category') >= 0){
          this.query.type =to.name == from.name && this.query.type.length != 0 ? this.query.type : ['no','name']
        }
      }
    }
  }
</script>
