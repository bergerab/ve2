ldoc.onpageload = function () {
    setTimeout(Prism.highlightAll, 0);
};
ldoc.header(() => '<div><img src="../img/ve2.png" height="50px"></img><span class="title">' + ldoc.pageName() + '</span></div>');
    

ldoc.name('ve2');
ldoc.page('Introduction', 'introduction', ldoc.file(), { hideHeader: true, footer: () => '<h2>Overview</h2>' + ldoc.sitemap() });
ldoc.page('Installation', 'installation', ldoc.file());
ldoc.page('Usage', 'usage', ldoc.file());
ldoc.subpage('usage', 'Creating a Vector', 'creating-a-vector', ldoc.file());
ldoc.subpage('usage', 'Scalar Operations', 'scalar-operations', ldoc.file());
ldoc.subpage('usage', 'Vector Operations', 'vector-operations', ldoc.file());
ldoc.page('License', 'license', ldoc.file()); 
ldoc.render();
