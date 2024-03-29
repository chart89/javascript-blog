const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagsLinks: Handlebars.compile(document.querySelector('#template-tags-link').innerHTML),
  authorLinks: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
}


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
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post .post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optAuthorClassCount = 4,
  optCloudClassPrefix = 'tag-size-',
  optauthorListSelector = '.authors.list';

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
    
        /* [NEW] use temple of the link */
        const linkHTMLData = {id: articleId, title: articleTitle};
        const linkHTML = templates.articleLink(linkHTMLData);
    
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

function calculateTagsParams(tags){
  const params = {max: 0, min: 999999};
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
    params.max = tags[tag];
    }
    if(tags[tag] < params.min){
    params.min = tags[tag];
}
  }
  return(params);
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return(classNumber);
}

function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {}; 

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
              
            /* [NEW] use templates of the link */
            const linkHTMLTags = {id: tag, title: tag};
            const tagsLink = templates.tagsLinks(linkHTMLTags);
             
            /* add generated code to html variable */
            html = html + tagsLink;

            /* NEW check if this link is NOT already in allTAgs */
            if(!allTags[tag]) {
              /* [NEW] add tag to allTag object */
              allTags[tag] = 1;
            } else {
              allTags[tag]++;
            }
        /* END LOOP: for each tag */
        }

        /* insert HTML of all the links into the tags wrapper */
        tagList.innerHTML = html;

    /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);

    /* [NEW] create variable for all links HTML code */
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /*[NEW] generate object and use it inside HTML tempalte */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log('allTagsData', allTagsData);
}

generateTags();


function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute("href");
    
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    
    /* find all tag links with class active */
    const allActiveLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  
    /* START LOOP: for each active tag link */
    for(let activeLink of allActiveLinks){
      /* remove class active */
      activeLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const allTagsHref = document.querySelectorAll('a[href="' + href + '"]');
    
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



  function calculateAuthorParams(authors){
    const params = {max: 0, min: 999999};
    for(let articleAuthors in authors){
      console.log(articleAuthors + ' is used ' + authors[articleAuthors] + ' times');
      if(authors[articleAuthors] > params.max){
      params.max = authors[articleAuthors];
      }
      if(authors[articleAuthors] < params.min){
      params.min = authors[articleAuthors];
  }
    }
    return(params);
  }


  function calculateAuthorClass(count, params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (optAuthorClassCount - 1) + 1 );
    return(classNumber);
  }

  function generateAuthors(){
    /* [NEW] create a new variable allTags with an empty object */
    const allAuthors = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    
    /* START LOOP: for every article */
    for(const article of articles){

      /* find authors wrapper*/
      const authorList = article.querySelector(optArticleAuthorSelector);
      
      /* make html variable with empty string */
      let html = '';

      /*get authors from data-authors attribute */
      const articleAuthors = article.getAttribute("data-author");

      /* generate HTML of the link */
      const linkHTMLAuthor = {id: articleAuthors, title: articleAuthors};
      const authorLinks = templates.authorLinks(linkHTMLAuthor);
    
      /*add generated code to html varriable */
      html = html + authorLinks;

      /* NEW check if this link is NOT already in allAuthors */
      if(!allAuthors[articleAuthors]) {
        /* [NEW] add tag to allAuthors object */
        allAuthors[articleAuthors] = 1;
      } else {
        allAuthors[articleAuthors]++;
      }
      /*insert HTML of all of the links into the authors wrapper */
      authorList.innerHTML = html;
    }
    /* [NEW] find list of tags in right column */
    const authorListRight = document.querySelector(optauthorListSelector);

    const authorsParams = calculateAuthorParams(allAuthors);
    console.log('authorsParams:', authorsParams);

    /* [NEW] create variable for all links HTML code */
    const allAuthorsData = {authors: []};

    /* [NEW] START LOOP: for each tag in allAuthors: */
    for(let articleAuthors in allAuthors){
      /*[NEW] generate object and use it inside HTML tempalte */
      allAuthorsData.authors.push({
        author: articleAuthors,
        count: allAuthors[articleAuthors],
        classNameAuthor: calculateAuthorClass(allAuthors[articleAuthors], authorsParams)
      });
    }
    /* [NEW] END LOOP: for each author in allauthors: */

    /*[NEW] add HTML from allAuthorsHTML to authorList */
    authorListRight.innerHTML = templates.authorCloudLink(allAuthorsData);
  }

  generateAuthors()



  function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute("href");
    
    /* make a new constant "author" and extract value from the "href" constant */
    const author = href.replace('#author-', '');
    
    /* find all author links with class active */
    const allActiveLinks = document.querySelectorAll('a.active[href^="#author-"]');
    
    /* START LOOP: for each active author link */
    for(let activeLink of allActiveLinks){
      /* remove class active */
      activeLink.classList.remove('active');
      /* END LOOP: for each active author link */
      }
    /* find all author links with "href" attribute equal to the "href" constant */
    const allAuthorsHref = document.querySelectorAll('a[href="' + href + '"]');
    
    /* START LOOP: for each found author link */
    for(let foundAuthorHref of allAuthorsHref){
      /* add class active */
      foundAuthorHref.classList.add('active');
      /* END LOOP: for each found author link */
      }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors(){
    /* find all links to author */
    const links = document.querySelectorAll('.post-author a, .authors a');

    /* START LOOP: for each link */
    for(let link of links){
      /* add authorClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
      /* END LOOP: for each link */
    }
  }
  
  addClickListenersToAuthors(); 
