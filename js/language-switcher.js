(function(){
  console.log('language-switcher: init')
  const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧', short: 'EN' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', short: 'FR' },
    { code: 'es', name: 'Español', flag: '🇪🇸', short: 'ES' },
    { code: 'zh', name: '中文', flag: '🇨🇳', short: 'CN' },
    // Traditional Chinese option under Chinese
    { code: 'zh-hant', name: '繁體中文', flag: '🇹🇼', short: 'TW' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', short: 'JP' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', short: 'KR' },
  ]

  const STORAGE_KEY = 'site_language'

  function getSavedLanguage(){
    try{
      const v = localStorage.getItem(STORAGE_KEY)
      return v || 'en'
    }catch(err){
      console.warn('language-switcher: localStorage unavailable, falling back to en', err)
      return 'en'
    }
  }

  function setSavedLanguage(code){
    try{
      localStorage.setItem(STORAGE_KEY, code)
    }catch(err){
      console.warn('language-switcher: unable to persist language selection', err)
    }
    document.documentElement.lang = code
    document.dispatchEvent(new CustomEvent('languageChange', { detail: { code } }))
    // Also attempt to localize immediately so selection reflects instantly in the UI
    try{ if (typeof localizePage === 'function') localizePage(code).catch(err => console.error('language-switcher: localize error', err)) }catch(e){ /* ignore */ }
  }

  /* Translations are loaded dynamically from /i18n/<lang>.json for maintainability. */
  let TRANSLATIONS = {}
  const TRANSLATION_CACHE = {}

  async function fetchTranslations(lang){
    if (TRANSLATION_CACHE[lang]) return TRANSLATION_CACHE[lang]
    
    // Check if we're running from file:// protocol (local file system)
    const isFileProtocol = window.location.protocol === 'file:'
    
    // Skip fetch attempts entirely when running from file:// protocol
    // CORS policy prevents fetch from working in file:// protocol
    if (isFileProtocol) {
      // Fallback to inline TRANSLATIONS object if present
      if (typeof TRANSLATIONS === 'object' && TRANSLATIONS[lang]){
        TRANSLATION_CACHE[lang] = TRANSLATIONS[lang]
        return TRANSLATIONS[lang]
      }
      // Return empty object to avoid errors
      TRANSLATION_CACHE[lang] = {}
      return {}
    }
    
    // Only attempt fetch when running from http/https protocol
    const tryPaths = [`/i18n/${lang}.json`, `i18n/${lang}.json`, `./i18n/${lang}.json`]
    for (const p of tryPaths){
      try{
        const res = await fetch(p, { cache: 'no-store' })
        if (!res.ok) throw new Error('Not found')
        const json = await res.json()
        TRANSLATION_CACHE[lang] = json
        return json
      }catch(err){
        // try next path
      }
    }
    // Fallback to inline TRANSLATIONS object if present
    if (typeof TRANSLATIONS === 'object' && TRANSLATIONS[lang]){
      TRANSLATION_CACHE[lang] = TRANSLATIONS[lang]
      return TRANSLATIONS[lang]
    }
    TRANSLATION_CACHE[lang] = {}
    return {}
  }

  async function getTranslation(key, lang){
    const map = await fetchTranslations(lang)
    if (map && map[key] != null) return map[key]
    const en = await fetchTranslations('en')
    return (en && en[key] != null) ? en[key] : null
  }
  TRANSLATIONS = {
  "en": {
    "company.name": "Advertising Studio",
    "nav.home": "Home",
    "nav.about": "ABOUT",
    "nav.services": "SERVICES",
    "nav.case": "CASES",
    "nav.contact": "Contact",
    "header.title": "Talent | Ambition | Originality | Networking",
    "header.title.translation": "Talent | Ambition | Originality | Networking",
    "header.subtitle": "We handle the details. You enjoy the results.",
    "carousel.title": "Brands We've Worked With",
    "featured.title": "OUR CLIENT CASES STUDIES",
    "featured.intro": "Our Collection Of Modern Photography. See also our portfolio on <a href=\"#\">Behance</a>",
    "contact.lead": "Leave us a message",
    "contact.title": "Contact us",
    "about.lead": "Company Profile",
    "about.title": "About Us",
    "about.subline": "TAON Advertising – About Us",
    "about.p1": "TAON Advertising Studio was founded in Shanghai with a vision to deliver fully integrated, high-quality branding solutions. Over the years, we have collaborated with diverse brands, corporations, and institutions, helping them translate their identity into compelling digital and physical experiences.",
    "about.p2": "Rooted in Shanghai, we have grown alongside the city's dynamic creative scene, building deep relationships with local and international brands alike. Our Shanghai studio serves as the hub of all operations—delivering strategy, design, and production as one integrated team.",
    "about.p3": "Our studio offers a complete suite of services—from strategic planning and brand design to website development, software solutions, and print production. With our own in-house manufacturing capabilities, we oversee the entire process, ensuring consistency, efficiency, and excellence at every touchpoint.",
    "about.p4": "At TAON, we believe that a strong brand is built through seamless integration across all channels. By aligning creative vision with technical execution, we help our clients create scalable, enduring brands that resonate with audiences and stand out in competitive markets.",
    "about.p5": "Whether you are launching a new brand, revitalizing an existing one, or expanding into new markets, TAON Advertising Studio combines strategy, creativity, and execution to deliver results that matter.",
    "services.lead": "What We Do",
    "services.title": "Services",
    "services.advertising.title": "Advertising Company Projects",
    "services.advertising.p": "Creative campaigns, photography, and integrated advertising projects tailored to brand needs.",
    "services.branding.title": "Corporate Branding Projects",
    "services.branding.p": "Brand identity, logos, guidelines and print collateral to build coherent brand systems.",
    "services.web.title": "Website & Software Development Services",
    "services.web.p": "Custom web and software development, e-commerce, CMS, and ongoing technical support.",
    "services.section.title": "Our Services",
    "services.section.intro": "We offer a full range of creative and print services.",
    "services.list.graphic_design": "Graphic Design",
    "services.list.vis_design": "VIS Design",
    "services.list.logo_design": "LOGO Design",
    "services.list.font_design": "Font Design",
    "services.list.poster_design": "Poster Design",
    "services.list.dm_design": "DM Design",
    "services.list.package_design": "Package Design",
    "services.list.signage_design": "Signage Design",
    "services.list.hand_drawn_illustration": "Hand-drawn Illustration",
    "services.list.photo_editing": "Photo Editing",
    "services.list.photo_enhancement": "Photo Enhancement",
    "services.list.3d_modeling": "3D Modeling",
    "services.list.digital_quick_printing": "Digital Quick Printing",
    "services.list.business_card_printing": "Business Card Printing",
    "services.list.brochure_printing": "Brochure / Folded Flyer Printing",
    "services.list.catalog_printing": "Catalog & Booklet Printing",
    "services.list.sticker_label_printing": "Sticker & Label Printing (Self-Adhesive)",
    "services.list.crystal_label_printing": "Crystal Label Printing",
    "services.list.large_format_printing": "Large Format Printing & Photo Printing",
    "services.list.custom_engraving": "Custom Engraving (All Types)",
    "services.list.signs_signage": "Signs & Signage",
    "services.list.roll_up_banners": "Roll-Up Banners",
    "services.list.x_banner_stands": "X-Banner Stands",
    "services.list.banners_flags": "Banners & Flags",
    "services.list.brand_websites": "Brand Websites Development",
    "services.list.app_development": "App Development",
    "services.list.wechat_mini_program": "WeChat Mini Program Development",
    "services.list.more": "MORE",
    "contact.info": "Contact Info",
    "contact.form": "Contact Form",
    "contact.submit": "Submit",
    "leave_message.title": "Leave A Message",
    "leave_message.subtitle": "Get in touch with us",
    "leave_message.service_context": "Inquiry about: {service}",
    "leave_message.form.title": "Leave A Message",
    "leave_message.form.name": "Your Name",
    "leave_message.form.email": "Your Email",
    "leave_message.form.subject": "Subject",
    "leave_message.form.message": "Your Message",
    "leave_message.form.submit": "Submit",
    "leave_message.form.placeholder.name": "Enter your name",
    "leave_message.form.placeholder.email": "Enter your email",
    "leave_message.form.placeholder.subject": "Subject of your inquiry",
    "leave_message.form.placeholder.message": "Tell us about your project...",
    "leave_message.success": "Thank you! Your message has been sent.",
    "leave_message.error": "Failed to send message. Please try again.",
    "leave_message.back_to_services": "Back to Services",
    "message_board.title": "Message Board",
    "message_board.loading": "Loading messages...",
    "message_board.no_messages": "No messages yet. Be the first to leave a message!",
    "message_board.posted_by": "Posted by",
    "message_board.on": "on",
    "message_board.reply": "Reply",
    "message_board.replies": "Replies",
    "message_board.reply_from": "Reply from",
    "message_board.reply_placeholder": "Write your reply...",
    "message_board.reply_submit": "Submit Reply",
    "message_board.reply_cancel": "Cancel",
    "message_board.reply_success": "Reply submitted successfully!",
    "message_board.reply_error": "Failed to submit reply. Please try again.",
    "message_board.load_more": "Load More",
    "message_board.refresh": "Refresh",
    "message_board.edit": "Edit",
    "message_board.delete": "Delete",
    "message_board.edit_message": "Edit Message",
    "message_board.delete_message": "Delete Message",
    "message_board.delete_confirm": "Are you sure you want to delete this message?",
    "message_board.edit_success": "Message updated successfully!",
    "message_board.edit_error": "Failed to update message. Please try again.",
    "message_board.delete_success": "Message deleted successfully!",
    "message_board.delete_error": "Failed to delete message. Please try again.",
    "message_board.save": "Save",
    "message_board.cancel": "Cancel",
    "message_board.not_owner": "You can only edit or delete your own messages.",
    "footer.social.facebook": "Facebook",
    "footer.social.instagram": "Instagram",
    "footer.social.x": "X",
    "footer.social.youtube": "YouTube",
    "footer.social.xiaohongshu": "Xiaohongshu",
    "footer.social.tiktok": "TikTok"
  },
  "zh": {
    "company.name": "广告工作室",
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.services": "服务",
    "nav.case": "案例",
    "nav.contact": "联系",
    "header.title": "人才 | 雄心 | 原创 | 人脉",
    "header.title.translation": "人才 | 雄心 | 原创 | 人脉",
    "header.subtitle": "我们处理细节，您尽享成果。",
    "carousel.title": "合作品牌",
    "featured.title": "精选作品",
    "featured.intro": "我们的现代摄影合集。也可查看我们的 <a href=\"#\">Behance</a> 作品集",
    "contact.lead": "给我们留言",
    "contact.title": "联系我们",
    "about.lead": "公司简介",
    "about.title": "关于我们",
    "about.subline": "TAON Advertising – 关于我们",
    "about.p1": "TAON Advertising Studio 成立于上海，致力于提供全面集成的高品质品牌解决方案。多年来，我们与众多品牌、企业和机构合作，帮助他们将品牌身份转化为引人入胜的数字和实体体验。",
    "about.p2": "深耕上海，我们与这座城市的创意生态共同成长，与本地及国际品牌建立了深厚的合作关系。我们的上海工作室是全部运营的核心——将战略、设计与制作融为一个整合团队提供。",
    "about.p3": "我们工作室提供完整的服务套件——从战略规划和品牌设计到网站开发、软件解决方案和印刷制作。凭借我们自己的内部制造能力，我们全程把控整个流程，确保在每个接触点都保持一致性、效率和卓越性。",
    "about.p4": "在 TAON，我们相信强大的品牌是通过所有渠道的无缝整合而建立的。通过将创意愿景与技术执行相结合，我们帮助客户创建可扩展、持久的品牌，这些品牌能够与受众产生共鸣，并在竞争激烈的市场中脱颖而出。",
    "about.p5": "无论您是在推出新品牌、重塑现有品牌，还是拓展新市场，TAON Advertising Studio 都将战略、创意和执行相结合，提供真正有价值的成果。",
    "services.lead": "我们做什么",
    "services.title": "服务",
    "services.advertising.title": "广告公司项目",
    "services.advertising.p": "为品牌量身定制的创意活动、摄影和整合广告项目。",
    "services.branding.title": "企业品牌项目",
    "services.branding.p": "品牌识别、标志、规范与印刷品，构建一致的品牌体系。",
    "services.web.title": "网站与软件开发服务",
    "services.web.p": "定制网站与软件开发、电商、CMS和持续技术支持。",
    "services.section.title": "我们的服务",
    "services.section.intro": "我们提供全方位的创意和印刷服务。",
    "services.list.graphic_design": "平面设计",
    "services.list.vis_design": "VIS设计",
    "services.list.logo_design": "LOGO设计",
    "services.list.font_design": "字体设计",
    "services.list.poster_design": "海报设计",
    "services.list.dm_design": "DM设计",
    "services.list.package_design": "包装设计",
    "services.list.signage_design": "标识设计",
    "services.list.hand_drawn_illustration": "手绘插画",
    "services.list.photo_editing": "照片编辑",
    "services.list.photo_enhancement": "照片增强",
    "services.list.3d_modeling": "3D建模",
    "services.list.digital_quick_printing": "数码快印",
    "services.list.business_card_printing": "名片印刷",
    "services.list.brochure_printing": "宣传册/折页印刷",
    "services.list.catalog_printing": "目录与手册印刷",
    "services.list.sticker_label_printing": "贴纸与标签印刷（不干胶）",
    "services.list.crystal_label_printing": "水晶标签印刷",
    "services.list.large_format_printing": "大幅面印刷与照片打印",
    "services.list.custom_engraving": "定制雕刻（所有类型）",
    "services.list.signs_signage": "标牌与标识",
    "services.list.roll_up_banners": "卷轴横幅",
    "services.list.x_banner_stands": "X型展架",
    "services.list.banners_flags": "横幅与旗帜",
    "services.list.brand_websites": "品牌网站开发",
    "services.list.app_development": "应用开发",
    "services.list.wechat_mini_program": "微信小程序开发",
    "services.list.more": "更多",
    "contact.info": "联系信息",
    "contact.form": "联系表单",
    "contact.submit": "提交",
    "leave_message.title": "留言",
    "leave_message.subtitle": "与我们取得联系",
    "leave_message.service_context": "咨询项目：{service}",
    "leave_message.form.title": "留言",
    "leave_message.form.name": "您的姓名",
    "leave_message.form.email": "您的邮箱",
    "leave_message.form.subject": "主题",
    "leave_message.form.message": "您的留言",
    "leave_message.form.submit": "提交",
    "leave_message.form.placeholder.name": "请输入您的姓名",
    "leave_message.form.placeholder.email": "请输入您的邮箱",
    "leave_message.form.placeholder.subject": "咨询主题",
    "leave_message.form.placeholder.message": "请告诉我们您的项目需求...",
    "leave_message.success": "感谢您！您的留言已发送。",
    "leave_message.error": "发送失败，请稍后重试。",
    "leave_message.back_to_services": "返回服务页面",
    "message_board.title": "留言板",
    "message_board.loading": "正在加载留言...",
    "message_board.no_messages": "暂无留言。成为第一个留言的人吧！",
    "message_board.posted_by": "留言者",
    "message_board.on": "于",
    "message_board.reply": "回复",
    "message_board.replies": "回复",
    "message_board.reply_from": "来自",
    "message_board.reply_placeholder": "写下您的回复...",
    "message_board.reply_submit": "提交回复",
    "message_board.reply_cancel": "取消",
    "message_board.reply_success": "回复提交成功！",
    "message_board.reply_error": "回复提交失败，请稍后重试。",
    "message_board.load_more": "加载更多",
    "message_board.refresh": "刷新",
    "message_board.edit": "编辑",
    "message_board.delete": "删除",
    "message_board.save": "保存",
    "message_board.cancel": "取消",
    "message_board.delete_confirm": "您确定要删除这条留言吗？",
    "message_board.not_owner": "您只能编辑或删除自己的留言。",
    "message_board.edit_success": "留言更新成功！",
    "message_board.edit_error": "更新留言失败，请稍后重试。",
    "message_board.delete_success": "留言删除成功！",
    "message_board.delete_error": "删除留言失败，请稍后重试。",
    "footer.social.facebook": "Facebook",
    "footer.social.instagram": "Instagram",
    "footer.social.x": "X",
    "footer.social.youtube": "YouTube",
    "footer.social.xiaohongshu": "小红书",
    "footer.social.tiktok": "抖音"
  },
  "zh-hant": {
    "nav.home": "首頁",
    "nav.about": "關於",
    "nav.services": "服務",
    "nav.case": "案例",
    "nav.contact": "聯絡",
    "header.title": "人才 | 雄心 | 原創 | 人脈",
    "header.title.translation": "人才 | 雄心 | 原創 | 人脈",
    "header.subtitle": "我們處理細節，您盡享成果。",
    "carousel.title": "合作品牌",
    "featured.title": "精選作品",
    "featured.intro": "我們的現代攝影合集。也可查看我們的 <a href=\"#\">Behance</a> 作品集",
    "contact.lead": "給我們留言",
    "contact.title": "聯絡我們",
    "about.lead": "公司簡介",
    "about.title":  "關於我們",
    "about.subline": "TAON Advertising – 關於我們",
    "about.p1": "TAON Advertising Studio 成立於上海，致力於提供全面整合的高品質品牌解決方案。多年來，我們與眾多品牌、企業和機構合作，幫助他們將品牌身份轉化為引人入勝的數位和實體體驗。",
    "about.p2": "深耕上海，我們與這座城市的創意生態共同成長，與本地及國際品牌建立了深厚的合作關係。我們的上海工作室是全部運營的核心——將戰略、設計與制作融為一個整合團隊提供。",
    "about.p3": "我們工作室提供完整的服務套件——從策略規劃和品牌設計到網站開發、軟體解決方案和印刷製作。憑藉我們自己的內部製造能力，我們全程把控整個流程，確保在每個接觸點都保持一致性、效率和卓越性。",
    "about.p4": "在 TAON，我們相信強大的品牌是透過所有渠道的無縫整合而建立的。透過將創意願景與技術執行相結合，我們幫助客戶創建可擴展、持久的品牌，這些品牌能夠與受眾產生共鳴，並在競爭激烈的市場中脫穎而出。",
    "about.p5": "無論您是在推出新品牌、重塑現有品牌，還是拓展新市場，TAON Advertising Studio 都將策略、創意和執行相結合，提供真正有價值的成果。",
    "services.lead": "我們做什麼",
    "services.title": "服務",
    "services.advertising.title": "廣告公司項目",
    "services.advertising.p": "為品牌量身定制的創意活動、攝影和整合廣告項目。",
    "services.branding.title": "企業品牌項目",
    "services.branding.p": "品牌識別、標誌、規範與印刷品，構建一致的品牌體系。",
    "services.web.title": "網站與軟件開發服務",
    "services.web.p": "定制網站與軟件開發、電商、CMS和持續技術支持。",
    "services.section.title": "我們的服務",
    "services.section.intro": "我們提供全方位的創意和印刷服務。",
    "services.list.graphic_design": "平面設計",
    "services.list.vis_design": "VIS設計",
    "services.list.logo_design": "LOGO設計",
    "services.list.font_design": "字體設計",
    "services.list.poster_design": "海報設計",
    "services.list.dm_design": "DM設計",
    "services.list.package_design": "包裝設計",
    "services.list.signage_design": "標識設計",
    "services.list.hand_drawn_illustration": "手繪插畫",
    "services.list.photo_editing": "照片編輯",
    "services.list.photo_enhancement": "照片增強",
    "services.list.3d_modeling": "3D建模",
    "services.list.digital_quick_printing": "數碼快印",
    "services.list.business_card_printing": "名片印刷",
    "services.list.brochure_printing": "宣傳冊/折頁印刷",
    "services.list.catalog_printing": "目錄與手冊印刷",
    "services.list.sticker_label_printing": "貼紙與標籤印刷（不乾膠）",
    "services.list.crystal_label_printing": "水晶標籤印刷",
    "services.list.large_format_printing": "大幅面印刷與照片打印",
    "services.list.custom_engraving": "定制雕刻（所有類型）",
    "services.list.signs_signage": "標牌與標識",
    "services.list.roll_up_banners": "卷軸橫幅",
    "services.list.x_banner_stands": "X型展架",
    "services.list.banners_flags": "橫幅與旗幟",
    "services.list.brand_websites": "品牌網站開發",
    "services.list.app_development": "應用開發",
    "services.list.wechat_mini_program": "微信小程序開發",
    "services.list.more": "更多",
    "contact.info": "聯絡資訊",
    "contact.form": "聯絡表單",
    "contact.submit": "提交",
    "leave_message.title": "留言",
    "leave_message.subtitle": "與我們取得聯繫",
    "leave_message.service_context": "諮詢項目：{service}",
    "leave_message.form.title": "留言",
    "leave_message.form.name": "您的姓名",
    "leave_message.form.email": "您的郵箱",
    "leave_message.form.subject": "主題",
    "leave_message.form.message": "您的留言",
    "leave_message.form.submit": "提交",
    "leave_message.form.placeholder.name": "請輸入您的姓名",
    "leave_message.form.placeholder.email": "請輸入您的郵箱",
    "leave_message.form.placeholder.subject": "諮詢主題",
    "leave_message.form.placeholder.message": "請告訴我們您的項目需求...",
    "leave_message.success": "感謝您！您的留言已發送。",
    "leave_message.error": "發送失敗，請稍後重試。",
    "leave_message.back_to_services": "返回服務頁面",
    "message_board.title": "留言板",
    "message_board.loading": "正在加載留言...",
    "message_board.no_messages": "暫無留言。成為第一個留言的人吧！",
    "message_board.posted_by": "留言者",
    "message_board.on": "於",
    "message_board.reply": "回覆",
    "message_board.replies": "回覆",
    "message_board.reply_from": "來自",
    "message_board.reply_placeholder": "寫下您的回覆...",
    "message_board.reply_submit": "提交回覆",
    "message_board.reply_cancel": "取消",
    "message_board.reply_success": "回覆提交成功！",
    "message_board.reply_error": "回覆提交失敗，請稍後重試。",
    "message_board.load_more": "加載更多",
    "message_board.refresh": "刷新",
    "message_board.edit": "编辑",
    "message_board.delete": "删除",
    "message_board.edit_message": "编辑留言",
    "message_board.delete_message": "删除留言",
    "message_board.delete_confirm": "您确定要删除这条留言吗？",
    "message_board.edit_success": "留言更新成功！",
    "message_board.edit_error": "更新留言失败，请稍后重试。",
    "message_board.delete_success": "留言删除成功！",
    "message_board.delete_error": "删除留言失败，请稍后重试。",
    "message_board.save": "保存",
    "message_board.cancel": "取消",
    "message_board.not_owner": "您只能编辑或删除自己的留言。",
    "footer.social.facebook": "Facebook",
    "footer.social.instagram": "Instagram",
    "footer.social.x": "X",
    "footer.social.youtube": "YouTube",
    "footer.social.xiaohongshu": "小紅書",
    "footer.social.tiktok": "抖音"
  },
  "fr": {
    "nav.home": "Accueil",
    "nav.about": "À PROPOS",
    "nav.services": "SERVICES",
    "nav.case": "CAS",
    "nav.contact": "Contact",
    "header.title": "Talent | Ambition | Originalité | Réseau",
    "header.title.translation": "Talent | Ambition | Originalité | Réseau",
    "header.subtitle": "Nous gérons les détails. Vous profitez des résultats.",
    "carousel.title": "Marques avec lesquelles nous avons travaillé",
    "featured.title": "Travaux en vedette",
    "featured.intro": "Notre collection de photographie moderne. Voir aussi notre portfolio sur <a href=\"#\">Behance</a>",
    "contact.lead": "Laissez-nous un message",
    "contact.title": "Contactez-nous",
    "contact.info": "Infos de contact",
    "contact.form": "Formulaire de contact",
    "contact.submit": "Envoyer",
    "leave_message.title": "Laisser un message",
    "leave_message.subtitle": "Contactez-nous",
    "leave_message.service_context": "Demande concernant : {service}",
    "leave_message.form.title": "Laisser un message",
    "leave_message.form.name": "Votre nom",
    "leave_message.form.email": "Votre email",
    "leave_message.form.subject": "Sujet",
    "leave_message.form.message": "Votre message",
    "leave_message.form.submit": "Envoyer le message",
    "leave_message.form.placeholder.name": "Entrez votre nom",
    "leave_message.form.placeholder.email": "Entrez votre email",
    "leave_message.form.placeholder.subject": "Sujet de votre demande",
    "leave_message.form.placeholder.message": "Parlez-nous de votre projet...",
    "leave_message.success": "Merci ! Votre message a été envoyé.",
    "leave_message.error": "Échec de l'envoi. Veuillez réessayer.",
    "leave_message.back_to_services": "Retour aux services",
    "message_board.title": "Tableau de messages",
    "message_board.loading": "Chargement des messages...",
    "message_board.no_messages": "Aucun message pour le moment. Soyez le premier à laisser un message !",
    "message_board.posted_by": "Publié par",
    "message_board.on": "le",
    "message_board.reply": "Répondre",
    "message_board.replies": "Réponses",
    "message_board.reply_from": "Réponse de",
    "message_board.reply_placeholder": "Écrivez votre réponse...",
    "message_board.reply_submit": "Envoyer la réponse",
    "message_board.reply_cancel": "Annuler",
    "message_board.reply_success": "Réponse envoyée avec succès !",
    "message_board.reply_error": "Échec de l'envoi de la réponse. Veuillez réessayer.",
    "message_board.load_more": "Charger plus",
    "message_board.refresh": "Actualiser",
    "message_board.edit": "Modifier",
    "message_board.delete": "Supprimer",
    "message_board.edit_message": "Modifier le message",
    "message_board.delete_message": "Supprimer le message",
    "message_board.delete_confirm": "Êtes-vous sûr de vouloir supprimer ce message ?",
    "message_board.edit_success": "Message mis à jour avec succès !",
    "message_board.edit_error": "Échec de la mise à jour du message. Veuillez réessayer.",
    "message_board.delete_success": "Message supprimé avec succès !",
    "message_board.delete_error": "Échec de la suppression du message. Veuillez réessayer.",
    "message_board.save": "Enregistrer",
    "message_board.cancel": "Annuler",
    "message_board.not_owner": "Vous ne pouvez modifier ou supprimer que vos propres messages.",
    "footer.social.facebook": "Facebook",
    "footer.social.instagram": "Instagram",
    "footer.social.x": "X",
    "footer.social.youtube": "YouTube",
    "footer.social.xiaohongshu": "Xiaohongshu",
    "footer.social.tiktok": "TikTok",
    "about.lead": "Profil de l'entreprise",
    "about.title": "À propos de nous",
    "about.subline": "TAON Advertising – À propos de nous",
    "about.p1": "TAON Advertising Studio a été fondé à Shanghai avec la vision de fournir des solutions de branding intégrées et de haute qualité. Au fil des ans, nous avons collaboré avec diverses marques, entreprises et institutions, les aidant à transformer leur identité en expériences numériques et physiques convaincantes.",
    "about.p2": "Ancré à Shanghai, nous avons grandi aux côtés de la scène créative dynamique de la ville, tissant des liens profonds avec des marques locales et internationales. Notre studio de Shanghai est le hub de toutes nos opérations, alliant stratégie, design et production au sein d'une équipe intégrée.",
    "about.p3": "Notre studio offre une gamme complète de services — de la planification stratégique et du design de marque au développement de sites web, aux solutions logicielles et à la production imprimée. Avec nos propres capacités de fabrication internes, nous supervisons l'ensemble du processus, garantissant cohérence, efficacité et excellence à chaque point de contact.",
    "about.p4": "Chez TAON, nous croyons qu'une marque forte se construit grâce à une intégration transparente sur tous les canaux. En alignant la vision créative avec l'exécution technique, nous aidons nos clients à créer des marques évolutives et durables qui résonnent avec les publics et se démarquent sur les marchés concurrentiels.",
    "about.p5": "Que vous lanciez une nouvelle marque, revitalisiez une existante ou vous développiez sur de nouveaux marchés, TAON Advertising Studio combine stratégie, créativité et exécution pour fournir des résultats qui comptent.",
    "services.lead": "Ce que nous faisons",
    "services.title": "Services",
    "services.advertising.title": "Projets d'agence publicitaire",
    "services.advertising.p": "Campagnes créatives, photographie et projets publicitaires intégrés adaptés aux besoins de la marque.",
    "services.branding.title": "Projets de branding d'entreprise",
    "services.branding.p": "Identité de marque, logos, guides et supports imprimés pour bâtir des systèmes de marque cohérents.",
    "services.web.title": "Services de développement Web et logiciel",
    "services.web.p": "Développement web et logiciel sur mesure, e‑commerce, CMS et support technique continu.",
    "services.section.title": "Nos services",
    "services.section.intro": "Nous offrons une gamme complète de services créatifs et d'impression.",
    "services.list.graphic_design": "Design graphique",
    "services.list.vis_design": "Design VIS",
    "services.list.logo_design": "Design de logo",
    "services.list.font_design": "Design de police",
    "services.list.poster_design": "Design d'affiche",
    "services.list.dm_design": "Design DM",
    "services.list.package_design": "Design d'emballage",
    "services.list.signage_design": "Design de signalisation",
    "services.list.hand_drawn_illustration": "Illustration à la main",
    "services.list.photo_editing": "Édition photo",
    "services.list.photo_enhancement": "Amélioration photo",
    "services.list.3d_modeling": "Modélisation 3D",
    "services.list.digital_quick_printing": "Impression numérique rapide",
    "services.list.business_card_printing": "Impression de cartes de visite",
    "services.list.brochure_printing": "Impression de brochures / dépliants",
    "services.list.catalog_printing": "Impression de catalogues et livrets",
    "services.list.sticker_label_printing": "Impression d'autocollants et d'étiquettes (autocollantes)",
    "services.list.crystal_label_printing": "Impression d'étiquettes cristal",
    "services.list.large_format_printing": "Impression grand format et photo",
    "services.list.custom_engraving": "Gravure personnalisée (tous types)",
    "services.list.signs_signage": "Panneaux et signalisation",
    "services.list.roll_up_banners": "Bannières enroulables",
    "services.list.x_banner_stands": "Supports X-Banner",
    "services.list.banners_flags": "Bannières et drapeaux",
    "services.list.brand_websites": "Développement de sites web de marque",
    "services.list.app_development": "Développement d'applications",
    "services.list.wechat_mini_program": "Développement de mini-programmes WeChat",
    "services.list.more": "PLUS",
    "contact.form": "Formulaire de contact",
    "contact.submit": "Envoyer",
    "leave_message.title": "Laisser un message",
    "leave_message.subtitle": "Contactez-nous",
    "leave_message.service_context": "Demande concernant : {service}",
    "leave_message.form.title": "Laisser un message",
    "leave_message.form.name": "Votre nom",
    "leave_message.form.email": "Votre email",
    "leave_message.form.subject": "Sujet",
    "leave_message.form.message": "Votre message",
    "leave_message.form.submit": "Envoyer le message",
    "leave_message.form.placeholder.name": "Entrez votre nom",
    "leave_message.form.placeholder.email": "Entrez votre email",
    "leave_message.form.placeholder.subject": "Sujet de votre demande",
    "leave_message.form.placeholder.message": "Parlez-nous de votre projet...",
    "leave_message.success": "Merci ! Votre message a été envoyé.",
    "leave_message.error": "Échec de l'envoi. Veuillez réessayer.",
    "leave_message.back_to_services": "Retour aux services",
  },
  "es": {
    "nav.home": "Inicio",
    "nav.about": "SOBRE",
    "nav.services": "SERVICIOS",
    "nav.case": "CASOS",
    "nav.contact": "Contacto",
    "header.title": "Talento | Ambición | Originalidad | Networking",
    "header.title.translation": "Talento | Ambición | Originalidad | Networking",
    "header.subtitle": "Nos encargamos de los detalles. Usted disfruta los resultados.",
    "carousel.title": "Marcas con las que hemos trabajado",
    "featured.title": "Trabajos destacados",
    "featured.intro": "Nuestra colección de fotografía moderna. Vea también nuestro portafolio en <a href=\"#\">Behance</a>",
    "contact.lead": "Envíanos un mensaje",
    "contact.title": "Contáctanos",
    "contact.info": "Información de contacto",
    "contact.form": "Formulario de contacto",
    "contact.submit": "Enviar",
    "footer.social.facebook": "Facebook",
    "footer.social.instagram": "Instagram",
    "footer.social.x": "X",
    "footer.social.youtube": "YouTube",
    "footer.social.xiaohongshu": "Xiaohongshu",
    "footer.social.tiktok": "TikTok",
    "about.lead": "Perfil de la empresa",
    "about.title": "Sobre nosotros",
    "about.subline": "TAON Advertising – Sobre nosotros",
    "about.p1": "TAON Advertising Studio se fundó en Shanghái con la visión de ofrecer soluciones de marca integradas y de alta calidad. A lo largo de los años hemos colaborado con marcas, corporaciones e instituciones diversas, ayudándolas a convertir su identidad en experiencias digitales y físicas impactantes.",
    "about.p2": "Con raíces en Shànghai, hemos crecido junto al dinámico ecosistema creativo de la ciudad, forjando relaciones sólidas con marcas locales e internacionales. Nuestro estudio en Shànghai es el centro de todas nuestras operaciones, combinando estrategia, diseño y producción en un equipo integrado.",
    "about.p3": "Nuestro estudio ofrece una suite completa de servicios: desde planificación estratégica y diseño de marca hasta desarrollo web, soluciones de software y producción impresa. Con nuestras capacidades de fabricación internas, supervisamos todo el proceso para garantizar coherencia, eficiencia y excelencia en cada punto de contacto.",
    "about.p4": "En TAON creemos que una marca sólida se construye mediante la integración fluida de todos los canales. Alineando la visión creativa con la ejecución técnica, ayudamos a nuestros clientes a crear marcas escalables y perdurables que conectan con las audiencias y destacan en mercados competitivos.",
    "about.p5": "Ya sea que lance una nueva marca, revitalice una existente o se expanda a nuevos mercados, TAON Advertising Studio combina estrategia, creatividad y ejecución para ofrecer resultados que importan.",
    "services.lead": "Lo que hacemos",
    "services.title": "Servicios",
    "services.advertising.title": "Proyectos de agencia publicitaria",
    "services.advertising.p": "Campañas creativas, fotografía y proyectos publicitarios integrados adaptados a las necesidades de la marca.",
    "services.branding.title": "Proyectos de branding corporativo",
    "services.branding.p": "Identidad de marca, logotipos, guías y material impreso para construir sistemas de marca coherentes.",
    "services.web.title": "Servicios de desarrollo web y software",
    "services.web.p": "Desarrollo web y de software a medida, comercio electrónico, CMS y soporte técnico continuo.",
    "services.section.title": "Nuestros servicios",
    "services.section.intro": "Ofrecemos una gama completa de servicios creativos e impresión.",
    "services.list.graphic_design": "Diseño gráfico",
    "services.list.vis_design": "Diseño VIS",
    "services.list.logo_design": "Diseño de logo",
    "services.list.font_design": "Diseño de fuente",
    "services.list.poster_design": "Diseño de cartel",
    "services.list.dm_design": "Diseño DM",
    "services.list.package_design": "Diseño de empaque",
    "services.list.signage_design": "Diseño de señalización",
    "services.list.hand_drawn_illustration": "Ilustración a mano",
    "services.list.photo_editing": "Edición de fotos",
    "services.list.photo_enhancement": "Mejora de fotos",
    "services.list.3d_modeling": "Modelado 3D",
    "services.list.digital_quick_printing": "Impresión digital rápida",
    "services.list.business_card_printing": "Impresión de tarjetas de visita",
    "services.list.brochure_printing": "Impresión de folletos / volantes plegables",
    "services.list.catalog_printing": "Impresión de catálogos y folletos",
    "services.list.sticker_label_printing": "Impresión de etiquetas y adhesivos (autoadhesivos)",
    "services.list.crystal_label_printing": "Impresión de etiquetas cristal",
    "services.list.large_format_printing": "Impresión gran formato y fotos",
    "services.list.custom_engraving": "Grabado personalizado (todos los tipos)",
    "services.list.signs_signage": "Señales y señalización",
    "services.list.roll_up_banners": "Banderas enrollables",
    "services.list.x_banner_stands": "Soportes X-Banner",
    "services.list.banners_flags": "Banderas y estandartes",
    "services.list.brand_websites": "Desarrollo de sitios web de marca",
    "services.list.app_development": "Desarrollo de aplicaciones",
    "services.list.wechat_mini_program": "Desarrollo de mini-programas WeChat",
    "services.list.more": "MÁS",
    "contact.form": "Formulario de contacto",
    "contact.submit": "Enviar",
    "leave_message.title": "Dejar un mensaje",
    "leave_message.subtitle": "Póngase en contacto con nosotros",
    "leave_message.service_context": "Consulta sobre: {service}",
    "leave_message.form.title": "Dejar un mensaje",
    "leave_message.form.name": "Su nombre",
    "leave_message.form.email": "Su email",
    "leave_message.form.subject": "Asunto",
    "leave_message.form.message": "Su mensaje",
    "leave_message.form.submit": "Enviar mensaje",
    "leave_message.form.placeholder.name": "Ingrese su nombre",
    "leave_message.form.placeholder.email": "Ingrese su email",
    "leave_message.form.placeholder.subject": "Asunto de su consulta",
    "leave_message.form.placeholder.message": "Cuéntenos sobre su proyecto...",
    "leave_message.success": "¡Gracias! Su mensaje ha sido enviado.",
    "leave_message.error": "Error al enviar mensaje. Por favor, intente de nuevo.",
    "leave_message.back_to_services": "Volver a servicios",
    "message_board.title": "Tablero de mensajes",
    "message_board.loading": "Cargando mensajes...",
    "message_board.no_messages": "Aún no hay mensajes. ¡Sé el primero en dejar un mensaje!",
    "message_board.posted_by": "Publicado por",
    "message_board.on": "el",
    "message_board.reply": "Responder",
    "message_board.replies": "Respuestas",
    "message_board.reply_from": "Respuesta de",
    "message_board.reply_placeholder": "Escribe tu respuesta...",
    "message_board.reply_submit": "Enviar respuesta",
    "message_board.reply_cancel": "Cancelar",
    "message_board.reply_success": "¡Respuesta enviada con éxito!",
    "message_board.reply_error": "Error al enviar respuesta. Por favor, intente de nuevo.",
    "message_board.load_more": "Cargar más",
    "message_board.refresh": "Actualizar",
    "message_board.edit": "Editar",
    "message_board.delete": "Eliminar",
    "message_board.edit_message": "Editar mensaje",
    "message_board.delete_message": "Eliminar mensaje",
    "message_board.delete_confirm": "¿Está seguro de que desea eliminar este mensaje?",
    "message_board.edit_success": "¡Mensaje actualizado con éxito!",
    "message_board.edit_error": "Error al actualizar el mensaje. Por favor, intente de nuevo.",
    "message_board.delete_success": "¡Mensaje eliminado con éxito!",
    "message_board.delete_error": "Error al eliminar el mensaje. Por favor, intente de nuevo.",
    "message_board.save": "Guardar",
    "message_board.cancel": "Cancelar",
    "message_board.not_owner": "Solo puede editar o eliminar sus propios mensajes.",
  },
  "ja": {
    "nav.home": "ホーム",
    "nav.about": "会社概要",
    "nav.services": "サービス",
    "nav.case": "事例",
    "nav.contact": "お問い合わせ",
    "header.title": "才能 | 野心 | 独創性 | ネットワーキング",
    "header.title.translation": "才能 | 野心 | 独創性 | ネットワーキング",
    "header.subtitle": "私たちは詳細を扱います。あなたは結果を楽しんでください。",
    "carousel.title": "協力ブランド",
    "featured.title": "注目作品",
    "featured.intro": "私たちの現代写真コレクション。ポートフォリオは <a href=\"#\">Behance</a> をご覧ください。",
    "contact.lead": "メッセージを残してください",
    "contact.title": "お問い合わせ",
    "contact.info": "連絡先情報",
    "contact.form": "お問い合わせフォーム",
    "contact.submit": "送信",
    "footer.social.facebook": "Facebook",
    "footer.social.instagram": "Instagram",
    "footer.social.x": "X",
    "footer.social.youtube": "YouTube",
    "footer.social.xiaohongshu": "Xiaohongshu",
    "footer.social.tiktok": "TikTok",
    "about.lead": "会社概要",
    "about.title": "私たちについて",
    "about.subline": "TAON Advertising – 私たちについて",
    "about.p1": "TAON Advertising Studioは、完全に統合された高品質のブランディングソリューションを提供するというビジョンのもと上海で設立されました。以来、多様なブランド、企業、機関と協業し、そのアイデンティティを魅力的なデジタルおよびフィジカル体験へと具現化する支援を行ってきました。",
    "about.p2": "上海に根ざし、この街のダイナミックなクリエイティブシーンとともに成長してきました。国内外のブランドと深い関係を築き、上海スタジオをすべての業務の拠点として、戦略・デザイン・制作を一体的なチームで提供しています。",
    "about.p3": "当スタジオは、戦略立案やブランドデザインから、ウェブサイト開発、ソフトウェアソリューション、印刷制作まで、包括的なサービスを提供します。自社の製造体制を備えているため、プロセス全体を管理し、あらゆるタッチポイントで一貫性・効率・卓越性を確保します。",
    "about.p4": "TAONでは、強いブランドはすべてのチャネルにわたるシームレスな統合によって築かれると考えています。クリエイティブなビジョンと技術的な実行を一致させることで、拡張性があり長く続くブランドを生み出し、オーディエンスに響き競争の激しい市場で際立つよう支援します。",
    "about.p5": "新しいブランドの立ち上げ、既存ブランドの刷新、新市場への展開のいずれであっても、TAON Advertising Studioは戦略・創造性・実行力を結集し、意味のある成果を届けます。",
    "services.lead": "私たちの事業",
    "services.title": "サービス",
    "services.advertising.title": "広告会社向けプロジェクト",
    "services.advertising.p": "ブランドのニーズに合わせたクリエイティブキャンペーン、写真撮影、統合型広告プロジェクト。",
    "services.branding.title": "コーポレートブランディングプロジェクト",
    "services.branding.p": "ブランドアイデンティティ、ロゴ、ガイドライン、印刷物により一貫したブランドシステムを構築します。",
    "services.web.title": "ウェブ＆ソフトウェア開発サービス",
    "services.web.p": "カスタムのウェブ・ソフトウェア開発、EC、CMS、継続的な技術サポート。",
    "services.section.title": "私たちのサービス",
    "services.section.intro": "クリエイティブと印刷の全範囲のサービスを提供しています。",
    "services.list.graphic_design": "グラフィックデザイン",
    "services.list.vis_design": "VISデザイン",
    "services.list.logo_design": "ロゴデザイン",
    "services.list.font_design": "フォントデザイン",
    "services.list.poster_design": "ポスターデザイン",
    "services.list.dm_design": "DMデザイン",
    "services.list.package_design": "パッケージデザイン",
    "services.list.signage_design": "サイン・標識デザイン",
    "services.list.hand_drawn_illustration": "手描きイラスト",
    "services.list.photo_editing": "写真編集",
    "services.list.photo_enhancement": "写真強化",
    "services.list.3d_modeling": "3Dモデリング",
    "services.list.digital_quick_printing": "デジタルクイック印刷",
    "services.list.business_card_printing": "名刺印刷",
    "services.list.brochure_printing": "パンフレット/折りたたみチラシ印刷",
    "services.list.catalog_printing": "カタログ・小冊子印刷",
    "services.list.sticker_label_printing": "ステッカー・ラベル印刷（自己接着式）",
    "services.list.crystal_label_printing": "クリスタルラベル印刷",
    "services.list.large_format_printing": "大型印刷・写真印刷",
    "services.list.custom_engraving": "カスタム彫刻（全タイプ）",
    "services.list.signs_signage": "看板・標識",
    "services.list.roll_up_banners": "ロールアップバナー",
    "services.list.x_banner_stands": "Xバナースタンド",
    "services.list.banners_flags": "バナー・旗",
    "services.list.brand_websites": "ブランドウェブサイト開発",
    "services.list.app_development": "アプリ開発",
    "services.list.wechat_mini_program": "WeChatミニプログラム開発",
    "services.list.more": "その他",
    "contact.form": "お問い合わせフォーム",
    "contact.submit": "送信",
    "leave_message.title": "メッセージを残す",
    "leave_message.subtitle": "お問い合わせ",
    "leave_message.service_context": "お問い合わせサービス：{service}",
    "leave_message.form.title": "メッセージを残す",
    "leave_message.form.name": "お名前",
    "leave_message.form.email": "メールアドレス",
    "leave_message.form.subject": "件名",
    "leave_message.form.message": "メッセージ",
    "leave_message.form.submit": "メッセージを送信",
    "leave_message.form.placeholder.name": "お名前を入力",
    "leave_message.form.placeholder.email": "メールアドレスを入力",
    "leave_message.form.placeholder.subject": "お問い合わせ件名",
    "leave_message.form.placeholder.message": "プロジェクトについてお聞かせください...",
    "leave_message.success": "ありがとうございます！メッセージを送信しました。",
    "leave_message.error": "メッセージの送信に失敗しました。もう一度お試しください。",
    "leave_message.back_to_services": "サービスに戻る",
    "message_board.title": "メッセージボード",
    "message_board.loading": "メッセージを読み込み中...",
    "message_board.no_messages": "まだメッセージがありません。最初のメッセージを残してください！",
    "message_board.posted_by": "投稿者",
    "message_board.on": "",
    "message_board.reply": "返信",
    "message_board.replies": "返信",
    "message_board.reply_from": "返信元",
    "message_board.reply_placeholder": "返信を書く...",
    "message_board.reply_submit": "返信を送信",
    "message_board.reply_cancel": "キャンセル",
    "message_board.reply_success": "返信が正常に送信されました！",
    "message_board.reply_error": "返信の送信に失敗しました。もう一度お試しください。",
    "message_board.load_more": "さらに読み込む",
    "message_board.refresh": "更新",
    "message_board.edit": "編集",
    "message_board.delete": "削除",
    "message_board.edit_message": "メッセージを編集",
    "message_board.delete_message": "メッセージを削除",
    "message_board.delete_confirm": "このメッセージを削除してもよろしいですか？",
    "message_board.edit_success": "メッセージが正常に更新されました！",
    "message_board.edit_error": "メッセージの更新に失敗しました。もう一度お試しください。",
    "message_board.delete_success": "メッセージが正常に削除されました！",
    "message_board.delete_error": "メッセージの削除に失敗しました。もう一度お試しください。",
    "message_board.save": "保存",
    "message_board.cancel": "キャンセル",
    "message_board.not_owner": "自分のメッセージのみ編集または削除できます。",
  },
  "ko": {
    "nav.home": "홈",
    "nav.about": "소개",
    "nav.services": "서비스",
    "nav.case": "사례",
    "nav.contact": "연락처",
    "header.title": "재능 | 야망 | 독창성 | 네트워킹",
    "header.title.translation": "재능 | 야망 | 독창성 | 네트워킹",
    "header.subtitle": "우리는 세부 사항을 처리합니다. 당신은 결과를 즐기세요.",
    "carousel.title": "협력 브랜드",
    "featured.title": "추천 작품",
    "featured.intro": "현대 사진 컬렉션입니다. 포트폴리오도 <a href=\"#\">Behance</a>에서 확인하세요.",
    "contact.lead": "메시지를 남겨주세요",
    "contact.title": "문의하기",
    "contact.info": "연락처 정보",
    "contact.form": "문의 양식",
    "contact.submit": "제출",
    "leave_message.title": "메시지 남기기",
    "leave_message.subtitle": "문의하기",
    "leave_message.service_context": "문의 서비스: {service}",
    "leave_message.form.title": "메시지 남기기",
    "leave_message.form.name": "이름",
    "leave_message.form.email": "이메일",
    "leave_message.form.subject": "제목",
    "leave_message.form.message": "메시지",
    "leave_message.form.submit": "메시지 보내기",
    "leave_message.form.placeholder.name": "이름을 입력하세요",
    "leave_message.form.placeholder.email": "이메일을 입력하세요",
    "leave_message.form.placeholder.subject": "문의 제목",
    "leave_message.form.placeholder.message": "프로젝트에 대해 알려주세요...",
    "leave_message.success": "감사합니다! 메시지가 전송되었습니다.",
    "leave_message.error": "메시지 전송에 실패했습니다. 나중에 다시 시도해주세요.",
    "leave_message.back_to_services": "서비스로 돌아가기",
    "footer.social.facebook": "Facebook",
    "footer.social.instagram": "Instagram",
    "footer.social.x": "X",
    "footer.social.youtube": "YouTube",
    "footer.social.xiaohongshu": "Xiaohongshu",
    "footer.social.tiktok": "TikTok",
    "about.lead": "회사 소개",
    "about.title": "회사 소개",
    "about.subline": "TAON Advertising – 회사 소개",
    "about.p1": "TAON Advertising Studio는 완전히 통합된 고품질 브랜딩 솔루션을 제공하겠다는 비전으로 상하이에서 설립되었습니다. 수년간 다양한 브랜드, 기업 및 기관과 협력하여 그들의 정체성을 매력적인 디지털 및 물리적 경험으로 전환하는 데 도움을 주었습니다.",
    "about.p2": "상하이에 부리를 두고 이 도시의 역동적인 창의적 생태계와 함께 성장해왓습니다. 국내외 브랜드와 깊은 관계를 구축하며, 상하이 스튜디오를 모든 운영의 허브로 삼아 전략, 디자인, 제작을 하나의 통합된 팀에서 제공합니다.",
    "about.p3": "우리 스튜디오는 전략적 기획 및 브랜드 디자인부터 웹사이트 개발, 소프트웨어 솔루션 및 인쇄 제작에 이르기까지 완전한 서비스 제품군을 제공합니다. 자체 내부 제조 역량을 갖추고 있어 전체 프로세스를 감독하며 모든 접점에서 일관성, 효율성 및 우수성을 보장합니다.",
    "about.p4": "TAON에서는 강력한 브랜드가 모든 채널에 걸친 원활한 통합을 통해 구축된다고 믿습니다. 창의적 비전과 기술적 실행을 조정함으로써 고객이 청중과 공명하고 경쟁 시장에서 두각을 나타내는 확장 가능하고 지속 가능한 브랜드를 만들 수 있도록 돕습니다.",
    "about.p5": "새로운 브랜드를 출시하든, 기존 브랜드를 활성화하든, 새로운 시장으로 확장하든, TAON Advertising Studio는 전략, 창의성 및 실행을 결합하여 중요한 결과를 제공합니다.",
    "services.lead": "우리가 하는 일",
    "services.title": "서비스",
    "services.advertising.title": "광고 회사 프로젝트",
    "services.advertising.p": "브랜드 요구에 맞춘 크리에이티브 캠페인, 사진 및 통합 광고 프로젝트.",
    "services.branding.title": "기업 브랜딩 프로젝트",
    "services.branding.p": "브랜드 아이덴티티, 로고, 가이드라인 및 인쇄물로 일관된 브랜드 시스템 구축.",
    "services.web.title": "웹 및 소프트웨어 개발 서비스",
    "services.web.p": "맞춤형 웹·소프트웨어 개발, 전자상거래, CMS 및 지속적인 기술 지원.",
    "services.section.title": "우리의 서비스",
    "services.section.intro": "창의적 및 인쇄 서비스의 전체 범위를 제공합니다.",
    "services.list.graphic_design": "그래픽 디자인",
    "services.list.vis_design": "VIS 디자인",
    "services.list.logo_design": "로고 디자인",
    "services.list.font_design": "폰트 디자인",
    "services.list.poster_design": "포스터 디자인",
    "services.list.dm_design": "DM 디자인",
    "services.list.package_design": "패키지 디자인",
    "services.list.signage_design": "간판 디자인",
    "services.list.hand_drawn_illustration": "손그림 일러스트",
    "services.list.photo_editing": "사진 편집",
    "services.list.photo_enhancement": "사진 향상",
    "services.list.3d_modeling": "3D 모델링",
    "services.list.digital_quick_printing": "디지털 빠른 인쇄",
    "services.list.business_card_printing": "명함 인쇄",
    "services.list.brochure_printing": "브로셔/접이식 전단지 인쇄",
    "services.list.catalog_printing": "카탈로그 및 소책자 인쇄",
    "services.list.sticker_label_printing": "스티커 및 라벨 인쇄 (자가 접착)",
    "services.list.crystal_label_printing": "크리스탈 라벨 인쇄",
    "services.list.large_format_printing": "대형 인쇄 및 사진 인쇄",
    "services.list.custom_engraving": "맞춤 조각 (모든 유형)",
    "services.list.signs_signage": "간판 및 표지판",
    "services.list.roll_up_banners": "롤업 배너",
    "services.list.x_banner_stands": "X 배너 스탠드",
    "services.list.banners_flags": "배너 및 깃발",
    "services.list.brand_websites": "브랜드 웹사이트 개발",
    "services.list.app_development": "앱 개발",
    "services.list.wechat_mini_program": "WeChat 미니 프로그램 개발",
    "services.list.more": "더보기",
    "message_board.title": "메시지 게시판",
    "message_board.loading": "메시지 로딩 중...",
    "message_board.no_messages": "아직 메시지가 없습니다. 첫 번째 메시지를 남겨보세요!",
    "message_board.posted_by": "작성자",
    "message_board.on": "",
    "message_board.reply": "답변",
    "message_board.replies": "답변",
    "message_board.reply_from": "답변자",
    "message_board.reply_placeholder": "답변을 작성하세요...",
    "message_board.reply_submit": "답변 제출",
    "message_board.reply_cancel": "취소",
    "message_board.reply_success": "답변이 성공적으로 제출되었습니다!",
    "message_board.reply_error": "답변 제출에 실패했습니다. 나중에 다시 시도해주세요.",
    "message_board.load_more": "더 보기",
    "message_board.refresh": "새로고침",
    "message_board.edit": "편집",
    "message_board.delete": "삭제",
    "message_board.edit_message": "메시지 편집",
    "message_board.delete_message": "메시지 삭제",
    "message_board.delete_confirm": "이 메시지를 삭제하시겠습니까?",
    "message_board.edit_success": "메시지가 성공적으로 업데이트되었습니다!",
    "message_board.edit_error": "메시지 업데이트에 실패했습니다. 나중에 다시 시도해주세요.",
    "message_board.delete_success": "메시지가 성공적으로 삭제되었습니다!",
    "message_board.delete_error": "메시지 삭제에 실패했습니다. 나중에 다시 시도해주세요.",
    "message_board.save": "저장",
    "message_board.cancel": "취소",
    "message_board.not_owner": "자신의 메시지만 편집하거나 삭제할 수 있습니다.",
  }
};

    // end TRANSLATIONS

  // Auto-assign data-i18n keys to elements without them (makes whole-site localizable)
  let autoKeyCounter = 0
  function scanAndAssignAutoKeys(){
    // ensure en map is available in cache
    const enMap = TRANSLATION_CACHE['en'] || TRANSLATIONS.en || {}

    // 1) scan leaf text nodes (same as before)
    const textNodes = Array.from(document.querySelectorAll('body *:not(script):not(style):not([data-i18n]):not([contenteditable]):not(input):not(textarea):not(select)'))
    textNodes.forEach(node => {
      if (node.childElementCount > 0) return
      const text = node.textContent && node.textContent.trim()
      if (!text || text.length < 2) return
      autoKeyCounter++
      const key = 'auto.' + autoKeyCounter
      node.setAttribute('data-i18n', key)
      // default to innerHTML so links are preserved
      if (!enMap[key]) enMap[key] = node.innerHTML
    })

    // 2) scan attributes: placeholder, alt, title
    const attrNames = ['placeholder','alt','title']
    attrNames.forEach(attr => {
      const els = Array.from(document.querySelectorAll(`[${attr}]:not([data-i18n])`))
      els.forEach(el => {
        const val = el.getAttribute(attr) && el.getAttribute(attr).trim()
        if (!val || val.length < 1) return
        autoKeyCounter++
        const key = 'auto.' + autoKeyCounter
        el.setAttribute('data-i18n', key)
        el.setAttribute('data-i18n-attr', attr)
        if (!enMap[key]) enMap[key] = val
      })
    })

    // 3) meta description / title
    const meta = document.querySelector('meta[name="description"]')
    if (meta && !meta.hasAttribute('data-i18n')){
      const val = meta.getAttribute('content') && meta.getAttribute('content').trim()
      if (val){
        autoKeyCounter++
        const key = 'auto.' + autoKeyCounter
        meta.setAttribute('data-i18n', key)
        meta.setAttribute('data-i18n-attr', 'content')
        if (!enMap[key]) enMap[key] = val
      }
    }

    // Keep EN translations updated in memory
    TRANSLATION_CACHE['en'] = enMap
    console.log('language-switcher: auto keys assigned', autoKeyCounter)
  }

  // Localize function: replace elements with data-i18n attribute (supports attributes)
  async function localizePage(code){
    console.log('language-switcher: localize', code)
    const lang = code || getSavedLanguage()
    
    // Update html lang attribute dynamically
    const langMap = {
      'en': 'en',
      'zh': 'zh-CN',
      'zh-hant': 'zh-TW',
      'fr': 'fr',
      'es': 'es',
      'ja': 'ja',
      'ko': 'ko'
    }
    const htmlLang = langMap[lang] || 'en'
    document.documentElement.lang = htmlLang
    
    const map = await fetchTranslations(lang)
    const en = await fetchTranslations('en')

    const els = Array.from(document.querySelectorAll('[data-i18n]'))
    for (const el of els){
      const key = el.getAttribute('data-i18n')
      const attr = el.getAttribute('data-i18n-attr')
      const value = (map && map[key] != null) ? map[key] : (en && en[key] != null) ? en[key] : null
      if (value == null) continue
      if (attr){
        el.setAttribute(attr, value)
      }else{
        // prefer safe text assignment; allow HTML only when translated string contains HTML tags
        if (/[<][a-z][\s\S]*>/i.test(value)) el.innerHTML = value
        else el.textContent = value
      }
    }
    
    // Handle placeholder translations (data-i18n-placeholder)
    const placeholderEls = Array.from(document.querySelectorAll('[data-i18n-placeholder]'))
    for (const el of placeholderEls){
      const key = el.getAttribute('data-i18n-placeholder')
      const value = (map && map[key] != null) ? map[key] : (en && en[key] != null) ? en[key] : null
      if (value != null) el.setAttribute('placeholder', value)
    }
    // also localize document.title if there is a key on <title>
    const titleEl = document.querySelector('title')
    if (titleEl && titleEl.hasAttribute('data-i18n')){
      const tkey = titleEl.getAttribute('data-i18n')
      const tval = (map && map[tkey] != null) ? map[tkey] : (en && en[tkey] != null) ? en[tkey] : null
      if (tval != null) titleEl.innerHTML = tval
    }
  }

  // listen to language changes globally
  document.addEventListener('languageChange', (e) => { localizePage(e.detail.code).catch(err => console.error('language-switcher: localize error', err)) })

  // report missing translations to console to help populate other languages
  async function reportMissingTranslations(){
    // Skip reporting when running from file:// protocol to avoid CORS errors
    if (window.location.protocol === 'file:') {
      console.log('language-switcher: skipping missing translations report (file:// protocol)')
      return {}
    }
    
    const en = await fetchTranslations('en')
    const enKeys = Object.keys(en || {})
    const languages = LANGUAGES.map(l => l.code).filter(l => l !== 'en')
    const missing = {}
    for (const lang of languages){
      const map = await fetchTranslations(lang)
      missing[lang] = enKeys.filter(k => (map[k] == null))
    }
    console.log('language-switcher: missing translations', missing)
    return missing
  }

  // expose helper on window so you can call it from console: await window.reportMissingTranslations()
  window.reportMissingTranslations = reportMissingTranslations

  // helper to download missing translations for a given language as JSON
  async function downloadMissingTranslations(lang){
    const missingObj = await reportMissingTranslations()
    const missing = missingObj[lang] || []
    const payload = {}
    missing.forEach(k => { payload[k] = null })
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `missing_${lang}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
  window.downloadMissingTranslations = downloadMissingTranslations

  // Translate single text using a LibreTranslate-compatible endpoint
  async function translateTextLibre(text, targetLang, sourceLang = 'en', apiUrl = 'https://libretranslate.de/translate'){
    // Map zh-hant to zh for most translation APIs
    const apiTarget = (targetLang === 'zh-hant') ? 'zh' : targetLang
    const payload = { q: text, source: sourceLang, target: apiTarget, format: 'text' }
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const text = await res.text().catch(()=>null)
      const errorText = text ? (' - ' + text.slice(0,200)) : ''
      throw new Error(`Translate API error: ${res.status}${errorText}`)
    }
    // try parse JSON, but tolerate plain text responses
    const raw = await res.text()
    let parsed
    try{ parsed = JSON.parse(raw) }catch(err){ parsed = null }
    if (parsed){ return parsed.translatedText || parsed.translated_text || parsed.result || '' }
    // if API returned plain text, return it directly
    return raw || ''
  }

  // Auto-translate missing keys for given languages (zh, fr, es, ja, ko, ru)
  async function autoTranslateMissingLanguages(langs = ['zh','fr','es','ja','ko','ru','zh-hant'], options = {}){
    const apiUrl = options.apiUrl || 'https://libretranslate.de/translate'
    const missing = await reportMissingTranslations()
    const en = await fetchTranslations('en')
    for (const lang of langs){
      const keys = missing[lang] || []
      if (!keys.length) { console.log(`language-switcher: no missing keys for ${lang}`); continue }
      console.log(`language-switcher: translating ${keys.length} keys to ${lang} using ${apiUrl}`)
      for (const key of keys){
        try{
          const sourceText = en[key]
          if (!sourceText){ console.warn('language-switcher: no source text for', key); continue }
          const translated = await translateTextLibre(sourceText, lang, 'en', apiUrl)
          TRANSLATION_CACHE[lang] = TRANSLATION_CACHE[lang] || {}
          TRANSLATION_CACHE[lang][key] = translated
          console.log('language-switcher: translated', key, '->', lang)
          // small delay to avoid rate limits
          await new Promise(r => setTimeout(r, options.delay || 250))
        }catch(err){ console.error('language-switcher: translation failed for', key, lang, err) }
      }
      // writeable: update in-memory cache, user can call exportTranslations(lang) to download
    }
    console.log('language-switcher: auto-translation finished. Use window.exportTranslations(lang) to download results.')
  }
  window.autoTranslateMissingLanguages = autoTranslateMissingLanguages

  // Export full translation object for a language
  function exportTranslations(lang){
    const payload = TRANSLATION_CACHE[lang] || {}
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translations_${lang}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
  window.exportTranslations = exportTranslations


    // container will be set when building the UI
    // (no-op here)

    // proceed
    // container.classList.add is used later in buildSwitcher when mounts are processed

  function buildSwitcher(container){
    // remove any fallback icon in this container to avoid duplicate visuals
    console.log('language-switcher: build for container', container)
    const existingFallback = container.querySelector('.globe-fallback')
    if (existingFallback) existingFallback.remove()

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'language-switcher-button'
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-label', 'Change language')

    // Inline SVG globe (reliable regardless of font files)
    const globe = document.createElement('span')
    globe.className = 'language-globe'
    globe.setAttribute('aria-hidden', 'true')
    globe.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.93 6h-2.2a12.1 12.1 0 00-1.04-2.59A8 8 0 0116.93 8zM12 4c.97 1.74 1.7 3.68 2.11 5H9.89C10.3 7.68 11.03 5.74 12 4zm-4.93 2A8 8 0 017.2 7.41 12.1 12.1 0 006.16 10H3.97A8.02 8.02 0 017.07 6zM4 12c0-.34.03-.67.07-1h2.25c.11 1.07.36 2.1.72 3.05A8.03 8.03 0 004 12zm8 8a8 8 0 01-3.93-1.02c.5-1.16 1-2.5 1.29-3.98h4.28c-.29 1.48-.79 2.82-1.29 3.98A8 8 0 0112 20zM13.97 17H10.03c.2-.83.5-1.63.84-2.36.34.73.64 1.53.9 2.36zM17.2 16.59c.36-.95.61-1.98.72-3.05H20a8.02 8.02 0 01-2.8 3.05z"/></svg>'
    button.appendChild(globe)

    const flagSpan = document.createElement('span')
    flagSpan.className = 'language-flag'
    flagSpan.style.marginLeft = '8px'
    button.appendChild(flagSpan)

    container.appendChild(button)

    // Create dropdown and append to body to avoid being clipped by parent overflow
    const dropdown = document.createElement('div')
    dropdown.className = 'language-dropdown'
    dropdown.setAttribute('role', 'menu')
    dropdown.style.position = 'absolute'
    dropdown.style.display = 'none'
    dropdown.style.zIndex = 99999

    LANGUAGES.forEach(lang => {
      const item = document.createElement('button')
      item.type = 'button'
      item.className = 'language-item'
      item.setAttribute('data-code', lang.code)
      item.innerHTML = `<span class="language-item-flag">${lang.flag}</span><span class="language-item-name">${lang.name}</span>`
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        console.log('language-switcher: selected', lang.code)
        setSavedLanguage(lang.code)
        updateUI()
        closeDropdown()
      })
      dropdown.appendChild(item)
    })

    // Append dropdown to body so it's not clipped by nav or header overflow
    document.body.appendChild(dropdown)
    console.log('language-switcher: dropdown appended for container', container, dropdown)

    function updateUI(){
      const cur = LANGUAGES.find(l => l.code === getSavedLanguage()) || LANGUAGES[0]
      // show short code (EN, CN, TW) next to the globe instead of country flag
      flagSpan.textContent = (cur.short || cur.code).toUpperCase()
      Array.from(dropdown.children).forEach(btn => {
        btn.classList.toggle('selected', btn.getAttribute('data-code') === cur.code)
      })
    }

    function positionDropdown(){
      const rect = button.getBoundingClientRect()
      // ensure dropdown has size for placement
      if (dropdown.style.display === 'none' || dropdown.style.display === ''){
        dropdown.style.visibility = 'hidden'
        dropdown.style.display = 'block'
      }
      const ddRect = dropdown.getBoundingClientRect()
      const left = Math.max(8, rect.right - ddRect.width)
      const top = rect.bottom + window.scrollY + 8
      dropdown.style.left = left + 'px'
      dropdown.style.top = top + 'px'
      if (dropdown.style.visibility === 'hidden') dropdown.style.visibility = ''
      console.log('language-switcher: positioned dropdown', left, top, 'rect', rect, 'ddRect', ddRect)
    }

    function openDropdown(){
      dropdown.style.display = 'block'
      positionDropdown()
      button.setAttribute('aria-expanded', 'true')
      document.addEventListener('click', onDocClick)
      window.addEventListener('resize', positionDropdown)
      window.addEventListener('scroll', positionDropdown)
    }

    function closeDropdown(){
      dropdown.style.display = 'none'
      button.setAttribute('aria-expanded', 'false')
      document.removeEventListener('click', onDocClick)
      window.removeEventListener('resize', positionDropdown)
      window.removeEventListener('scroll', positionDropdown)
    }

    function onDocClick(e){
      // if the click is neither inside the mount container nor inside the dropdown, close it
      if (!container.contains(e.target) && !dropdown.contains(e.target)) closeDropdown()
    }

    button.addEventListener('click', (e) => {
      e.stopPropagation()
      // toggle display-based dropdown
      if (dropdown.style.display === 'none' || dropdown.style.display === '') openDropdown(); else closeDropdown()
    })

    // initialize
    updateUI()
    document.documentElement.lang = getSavedLanguage()
    localizePage(getSavedLanguage()).then(() => {
      // Ensure footer translations are applied (footer might load after initial localization)
      setTimeout(() => {
        const footerLinks = document.querySelectorAll('footer [data-i18n]')
        if (footerLinks.length > 0) {
          localizePage(getSavedLanguage()).catch(err => console.error('language-switcher: footer re-localize error', err))
        }
      }, 100)
    })
    }

  async function init(){
    // Load English translations into cache
    TRANSLATION_CACHE['en'] = await fetchTranslations('en')

    // Auto-scan page and assign data-i18n keys (creates translation keys for all visible text and attributes)
    scanAndAssignAutoKeys()

    // report missing translations (for developer visibility)
    // note: this will check against files when called in console since we fetch per-language
    reportMissingTranslations()

    // Always localize page on load
    await localizePage(getSavedLanguage())

    // Initialize for every mount point (support pages with nav mounts)
    const mounts = document.querySelectorAll('#react-language-switcher, .react-language-switcher')
    if (mounts.length === 0) console.warn('language-switcher: no mounts found')
    mounts.forEach((mount, i) => {
      console.log('language-switcher: initializing mount', i, mount)
      // hide fallback (if any) and build
      buildSwitcher(mount)
      // after building, mark the container so fallback is hidden via CSS
      mount.classList.add('language-switcher')
    })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
})();
