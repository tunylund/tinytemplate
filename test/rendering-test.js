describe('rendering', function() {

  it('should render without any params', function() {
    var template = 'foobar'
    assert.equal(template, TinyTemplate.render(template))
  })

  it('should render with simple value object', function() {
    var template = 'foobar{value}'
    assert.equal('foobarBAR', TinyTemplate.render(template, {value: 'BAR'}))
  })

  it('should loop an array-value object', function() {
    var template = 'foobar{value}'
    assert.equal('foobarBARfoobarCAR', TinyTemplate.render(template, [{value: 'BAR'}, {value: 'CAR'}]))
  })

  it('should evaluate functions into its value', function() {
    var template = 'foobar{value}'
    assert.equal('foobarBAR', TinyTemplate.render(template, {value: function() { return 'BAR'}}))
  })

  it('should render an empty string for nully values', function() {
    var template = 'foobar{value}'
    assert.equal('foobar', TinyTemplate.render(template, {value: function() {}}))
    assert.equal('foobar', TinyTemplate.render(template, {value: null}))
    assert.equal('foobar', TinyTemplate.render(template, {value: undefined}))
    assert.equal('foobar', TinyTemplate.render(template, {value: ""}))
    assert.equal('foobar', TinyTemplate.render(template, {}))
  })

  it('should not assume 0, boolean or space is nully', function() {
    var template = 'foobar{value}'
    assert.equal('foobar0', TinyTemplate.render(template, {value: 0}))
    assert.equal('foobarfalse', TinyTemplate.render(template, {value: false}))
    assert.equal('foobar  ', TinyTemplate.render(template, {value: "  "}))
  })

  it('should escape bad characters in value', function() {
    var template = 'foobar{value}'
    assert.equal('foobar&lt;', TinyTemplate.render(template, {value: '<'}))
    assert.equal('foobar&gt;', TinyTemplate.render(template, {value: '>'}))
    assert.equal('foobar&#39;', TinyTemplate.render(template, {value: '\''}))
    assert.equal('foobar&quot;', TinyTemplate.render(template, {value: '"'}))
    assert.equal('foobar&amp;', TinyTemplate.render(template, {value: '&'}))
  })

})