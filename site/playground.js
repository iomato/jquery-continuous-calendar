requirejs.config({
  paths: {
    'jquery': '../src/lib/jquery-1.8.0.min',
    'jquery.tinyscrollbar': '../src/main/jquery.tinyscrollbar-1.66/jquery.tinyscrollbar'
  }
})
require(['jquery', '../src/main/jquery.continuousCalendar', '../src/main/DateFormat', '../src/main/DateLocale', '../src/main/DateTime'], function($, _calendar, DateFormat, DateLocale, DateTime) {
  jQuery = $

  counter = 0
  $('#create').click(create)

  var disabledDates = $([DateTime.now(), DateTime.now(), DateTime.now()])
    .map(function(i, el) { return DateFormat.format(el.plusDays(i + 3), 'n/j/Y') })
    .toArray()
    .join(' ')
  $('#disabledDates').val(disabledDates)
  var selection = $([DateTime.now().plusDays(10), DateTime.now().plusDays(18)])
    .map(function(i, el) { return DateFormat.format(el, 'n/j/Y') })
    .toArray()
  $('#selectionStart').val(selection[0])
  $('#selectionEnd').val(selection[1])

  create()

  function create() {
    var containerClass = 'container' + counter
    var container = $('<div>').addClass(containerClass).addClass($('[name=theme]:checked').val())
    var containerWrapper = $('<div class="containerWrapper">').append(container)
    if(valueOf('isRange')) {
      container.append('<input type="hidden" class="startDate" value="' + $('#selectionStart').val() + '" /><input type="hidden" class="endDate" value="' + $('#selectionEnd').val() + '"/>')
    }
    $('body').append(containerWrapper)
    var optionsList = [ 'selectToday', 'disableWeekends', 'isPopup', 'weeksBefore', 'weeksAfter', 'firstDate', 'lastDate', 'minimumRange', 'selectWeek', 'disabledDates', 'fadeOutDuration', 'customScroll' ]
    var options = {}
    for(var i = 0; i < optionsList.length; i++) {
      var value = valueOf(optionsList[i])
      if(value) {
        options[optionsList[i]] = value
      }
    }
    options.locale = DateLocale[$('[name=locale]:checked').val()]
    var params = JSON.stringify(options)
    containerWrapper.prepend('<textarea  class="example_params">$(selector).continuousCalendar(' + params + ')</textarea>')
    container.continuousCalendar(options)
    function valueOf(id) {
      var elem = $('#' + id)
      return elem.attr('type') == 'checkbox' ? elem.filter(':checked').length > 0 : elem.val()
    }
    return false
  }
})