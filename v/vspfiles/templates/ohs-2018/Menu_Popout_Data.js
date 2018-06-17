
function display_menu_1() {
  navStyle1.image=Config_CDN_URL + "v/vspfiles/templates/ohs-2018/images/Template/Menu1_Bullet.gif";
  navStyle1.subimage=Config_CDN_URL + "v/vspfiles/templates/ohs-2018/images/Template/Menu1_Bullet_End.gif";
  with(milonic=new menuname("m_v1p0")) {
    style=navStyle1;
    itemwidth="970";
    alwaysvisible=1;
    orientation="horizontal";
    position="relative";
    aI("text=All Products;url=https://www.optimalhealthsystems.com/category-s/1814.htm;pagematch=[-_]s/1814\\.htm$|searchresults\\.asp\\?cat=1814$;");
    aI("text=Opti-Nutrient Dr. Brimhall;url=https://www.optimalhealthsystems.com/category-s/1926.htm;pagematch=[-_]s/1926\\.htm$|searchresults\\.asp\\?cat=1926$;");
    aI("text=Dr. Marc Harris Essential;url=https://www.optimalhealthsystems.com/category-s/1515.htm;pagematch=[-_]s/1515\\.htm$|searchresults\\.asp\\?cat=1515$;");
    aI("text=Performance & Energy;url=https://www.optimalhealthsystems.com/category-s/1824.htm;pagematch=[-_]s/1824\\.htm$|searchresults\\.asp\\?cat=1824$;");
    aI("text=Fat Loss & Energy;url=https://www.optimalhealthsystems.com/category-s/1819.htm;pagematch=[-_]s/1819\\.htm$|searchresults\\.asp\\?cat=1819$;");
    aI("text=Pain / Inflammation & Joint;url=https://www.optimalhealthsystems.com/category-s/1820.htm;pagematch=[-_]s/1820\\.htm$|searchresults\\.asp\\?cat=1820$;");
    aI("text=Cleanses (organ & toxins);url=https://www.optimalhealthsystems.com/category-s/1821.htm;pagematch=[-_]s/1821\\.htm$|searchresults\\.asp\\?cat=1821$;");
    aI("text=Health Professionals;url=https://www.optimalhealthsystems.com/category-s/1923.htm;pagematch=[-_]s/1923\\.htm$|searchresults\\.asp\\?cat=1923$;showmenu=m_v1p1923;");
  }
  subNavStyle1.image=Config_CDN_URL +"v/vspfiles/templates/ohs-2018/images/Template/Menu1_Bullet.gif";
  subNavStyle1.subimage=Config_CDN_URL +"v/vspfiles/templates/ohs-2018/images/Template/Menu1_Bullet_End.gif";
  with(milonic=new menuname("m_v1p1923")) {
    style=subNavStyle1;
    aI("text=Professional Testing Systems&nbsp;&nbsp;&nbsp;;url=https://www.optimalhealthsystems.com/category-s/1927.htm;pagematch=[-_]s/1927\\.htm$|searchresults\\.asp\\?cat=1927$;");
  }
  drawMenus();
}

