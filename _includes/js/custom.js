function collectPageHeadings() {
  var main = document.querySelector('#main-content main')

  if (!main) {
    return []
  }

  return Array.from(main.querySelectorAll('h2[id], h3[id]')).filter(function (heading) {
    var nextSibling = heading.nextElementSibling

    // Skip the lead heading when it is only acting as a page title.
    if (nextSibling && nextSibling.tagName === 'HR') {
      return false
    }

    return heading.textContent.trim() !== ''
  })
}

function appendPageHeadingItems(targetList, headings, itemClassName, levelClassPrefix, linkClassName, subListClassName) {
  var currentSubList = null

  headings.forEach(function (heading) {
    var item = document.createElement('li')
    var link = document.createElement('a')
    var level = heading.tagName.toLowerCase()

    item.className = itemClassName + ' ' + levelClassPrefix + '--' + level
    link.className = linkClassName
    link.href = '#' + heading.id
    link.textContent = heading.textContent.trim()

    item.appendChild(link)

    if (level === 'h2') {
      targetList.appendChild(item)
      currentSubList = null
      return
    }

    if (!currentSubList) {
      var lastTopLevelItem = targetList.lastElementChild

      if (!lastTopLevelItem) {
        targetList.appendChild(item)
        return
      }

      currentSubList = document.createElement('ul')
      currentSubList.className = subListClassName
      lastTopLevelItem.appendChild(currentSubList)
    }

    currentSubList.appendChild(item)
  })
}

function buildSidebarPageNav(headings) {
  var siteNav = document.getElementById('site-nav')

  if (!siteNav || headings.length < 1) {
    return
  }

  var currentLink = siteNav.querySelector('.nav-list-link.active')

  if (!currentLink) {
    return
  }

  var currentItem = currentLink.closest('.nav-list-item')

  if (!currentItem || currentItem.querySelector('.nav-list--page-sections')) {
    return
  }

  var sectionList = document.createElement('ul')

  sectionList.className = 'nav-list nav-list--page-sections'

  appendPageHeadingItems(
    sectionList,
    headings,
    'nav-list-item nav-list-item--page-section',
    'nav-list-item--page-section',
    'nav-list-link nav-list-link--page-section',
    'nav-list nav-list--page-subsections'
  )

  currentItem.classList.add('nav-list-item--page-sections')
  currentItem.appendChild(sectionList)

  function setExpanded(expanded) {
    currentItem.classList.toggle('sidebar-page-nav-open', expanded)
  }

  function toggleExpanded(event) {
    event.preventDefault()
    setExpanded(!currentItem.classList.contains('sidebar-page-nav-open'))
  }

  currentLink.classList.add('nav-list-link--page-toggle')
  currentLink.addEventListener('click', toggleExpanded)

  setExpanded(true)
}

window.jtd.onReady(function () {
  var headings = collectPageHeadings()

  buildSidebarPageNav(headings)
})
