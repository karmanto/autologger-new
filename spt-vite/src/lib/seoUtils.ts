export const setMetaTag = (name: string, content: string, isProperty = false) => {
  const attribute = isProperty ? 'property' : 'name';
  let tag = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

export const removeMetaTag = (name: string, isProperty = false) => {
  const attribute = isProperty ? 'property' : 'name';
  const tag = document.querySelector(`meta[${attribute}="${name}"]`);
  if (tag) {
    tag.remove();
  }
};

export const setLinkTag = (rel: string, href: string, attributeName: string = 'href', attributeValue: string = href) => {
  let tag = document.querySelector(`link[rel="${rel}"][${attributeName}="${attributeValue}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute(attributeName, attributeValue); 
};

export const removeLinkTagByRel = (rel: string) => {
  document.querySelectorAll(`link[rel="${rel}"]`).forEach(link => link.remove());
};

export const clearAllDynamicSEOTags = () => {
  document.title = "Simbolon Phuket Tour"; 
  removeMetaTag('description');
  removeMetaTag('author');
  removeMetaTag('robots');
  removeLinkTagByRel('canonical');
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
};
