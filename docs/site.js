ldoc.onpageload = function () {
    setTimeout(Prism.highlightAll, 0);
};
ldoc.header(() => '<h1>' + ldoc.pageName() + '</h1>');

ldoc.name('ve2');
ldoc.page('Introduction', 'introduction', ldoc.file(), { hideHeader: true, footer: () => '<h2>Overview</h2>' + ldoc.sitemap() });
ldoc.page('Installation', 'installation', ldoc.file());
ldoc.page('Usage', 'usage', ldoc.file());
ldoc.subpage('usage', 'Creating a Vector', 'creating-a-vector', ldoc.file());
ldoc.subpage('usage', 'Scalar Operations', 'scalar-operations', ldoc.file());
ldoc.subpage('usage', 'Vector Operations', 'vector-operations', ldoc.file());
ldoc.page('License', 'license', ldoc.file()); 
ldoc.render();
