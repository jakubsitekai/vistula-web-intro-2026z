(() => {
  "use strict";
  const lessons = [
    {id:"w1",title:"W1 · Internet, HTTP, HTML i Git",file:"w1-internet-http-html-git.md"},
    {id:"w2",title:"W2 · CSS, layout i responsive",file:"w2-css-layout-responsive.md"},
    {id:"w3",title:"W3 · JavaScript, DOM i zdarzenia",file:"w3-javascript-dom-events.md"},
    {id:"w4",title:"W4 · JSON, REST, SQL i Supabase",file:"w4-json-fetch-rest-supabase.md"}
  ];
  const params = new URLSearchParams(location.search);
  const key = params.get("w") || "w1";
  const index = lessons.findIndex(x => x.id === key);
  if (index < 0) { document.getElementById("content").textContent = "Nieznany wykład."; return; }
  const lesson = lessons[index];
  document.title = lesson.title + " | Vistula 2026Z";
  document.getElementById("lecture-title").textContent = lesson.title;
  document.getElementById("source-link").href = "./" + lesson.file;

  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  const inline = value => {
    let str = escapeHTML(value);
    str = str.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_,name,url) =>
      '<a href="' + escapeHTML(url) + '" target="_blank" rel="noopener noreferrer">' + name + '</a>'
    );
    str = str.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return str;
  };
  const slug = value => value.toLocaleLowerCase("pl").replace(/[^a-z0-9ąćęłńóśżź\s-]/g,"")
       .trim().replace(/\s+/g,"-").replace(/-+/g,"-");

  function parseMarkdown(md) {
    const lines = md.replace(/\r\n?/g,"\n").split("\n");
    const out=[], headings=[]; let paragraph=[],list=null,code=null,codeLanguage="";
    const flushParagraph=()=>{ if(paragraph.length){out.push("<p>"+inline(paragraph.join(" "))+"</p>");paragraph=[];} };
    const closeList=()=>{if(list){out.push("</"+list+">");list=null;}};
    const pushList=(kind,text)=>{flushParagraph();if(list!==kind){closeList();out.push("<"+kind+">");list=kind;}out.push("<li>"+inline(text)+"</li>");};
    let duplicates = Object.create(null);
    for (const line of lines) {
      const fence=line.match(/^~~~\s*(.*)$/);
      if(fence){
        flushParagraph();closeList();
        if(code===null){code=[];codeLanguage=fence[1]||"";}
        else {out.push('<pre><code class="language-'+escapeHTML(codeLanguage)+'">'+escapeHTML(code.join("\n"))+"</code></pre>");code=null;}
        continue;
      }
      if(code!==null){code.push(line);continue;}
      if(!line.trim()){flushParagraph();closeList();continue;}
      const heading=line.match(/^(#{1,4})\s+(.+)$/);
      if(heading){flushParagraph();closeList();const level=heading[1].length;
        let id=slug(heading[2])||"sekcja";duplicates[id]=(duplicates[id]||0)+1;
        if(duplicates[id]>1)id+="-"+duplicates[id];
        out.push("<h"+level+' id="'+id+'">'+inline(heading[2])+"</h"+level+">");
        if(level===2||level===3)headings.push({level,id,text:heading[2]});
        continue;
      }
      const unordered=line.match(/^[-*]\s+(.+)$/);
      if(unordered){pushList("ul",unordered[1]);continue;}
      const ordered=line.match(/^\d+\.\s+(.+)$/);
      if(ordered){pushList("ol",ordered[1]);continue;}
      if(list)closeList();
      paragraph.push(line.trim());
    }
    flushParagraph();closeList();
    if(code!==null)out.push('<pre><code>'+escapeHTML(code.join("\n"))+"</code></pre>");
    return {html:out.join("\n"),headings};
  }
  async function load() {
    const article=document.getElementById("content");
    try{
      const response=await fetch("./"+lesson.file);
      if(!response.ok)throw new Error("HTTP "+response.status);
      const md=await response.text();
      const parsed=parseMarkdown(md);
      article.innerHTML=parsed.html;
      const toc=document.getElementById("toc");
      for(const h of parsed.headings){
        const li=document.createElement("li"),a=document.createElement("a");
        a.href="#"+h.id;a.textContent=h.text;li.append(a);
        if(h.level===3)li.style.paddingLeft="12px";
        toc.append(li);
      }
      const nav=document.getElementById("lesson-navigation");
      if(index>0){const a=document.createElement("a");a.href="?w="+lessons[index-1].id;a.textContent="Poprzedni: "+lessons[index-1].title;nav.append(a);}
      if(index<lessons.length-1){const a=document.createElement("a");a.href="?w="+lessons[index+1].id;a.textContent="Następny: "+lessons[index+1].title;nav.append(a);}
    }catch(error){
      article.textContent="Nie udało się pobrać materiału. Spróbuj ponownie lub otwórz plik źródłowy Markdown.";
      console.error(error);
    }
  }
  load();
})();