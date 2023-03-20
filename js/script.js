'use strict';
const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links  */
    const activeLinks=document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles=document.querySelectorAll('.posts article.active');
    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute("href");
   
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}
  



const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list';

function generateTitleLinks(customSelector = ''){
  
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    
    let html = '';
    for(let article of articles){
        /* get the article id */
        const articleId = article.getAttribute("id");

        /* get the title from the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    
        /* create HTML of the link */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    
        /* insert link into titleList */
        html = html + linkHTML;
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }
}

generateTitleLinks();


function generateTags(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    
    /* START LOOP: for every article: */
    for(let article of articles){
        /* find tags wrapper */
        const tagList = article.querySelector(optArticleTagsSelector);
        
        /* make html variable with empty string */
        let html = '';

        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute("data-tags");
        
        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        
        /* START LOOP: for each tag */
        for (let tag of articleTagsArray){  
              
            /* generate HTML of the link */
            const tagsLink = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
             
            /* add generated code to html variable */
            html = html + tagsLink;
            
        /* END LOOP: for each tag */
        }

        /* insert HTML of all the links into the tags wrapper */
        tagList.innerHTML = html;

    /* END LOOP: for every article: */
    }
}

generateTags();


function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    console.log('Tag was Clicked', clickedElement);
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute("href");
    console.log(href);
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    console.log(tag);
    /* find all tag links with class active */
    const allActiveLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    console.log(allActiveLinks);
    /* START LOOP: for each active tag link */
    for(let activeLink of allActiveLinks){
      /* remove class active */
      activeLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const allTagsHref = document.querySelectorAll('a[href="' + href + '"]');
    console.log(allTagsHref);
    /* START LOOP: for each found tag link */
    for(let foundTagHref of allTagsHref){
      /* add class active */
      foundTagHref.classList.add('active');

    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(){
    /* find all links to tags */
    const links = document.querySelectorAll('.list-horizontal a, .tags a');
    /* START LOOP: for each link */
    for(let link of links){
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
    }
  }
  
  addClickListenersToTags();