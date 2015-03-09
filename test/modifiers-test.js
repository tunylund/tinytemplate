describe('rendering', function() {

  it('should recognize registered modifier', function() {
    var template = 'foobar{modA}'
    TinyTemplate.registerModifier('modA', function() {
      return 'success'
    })
    assert.equal('foobarsuccess', TinyTemplate.render(template))
  })

  describe('? (render if truthy) modifier', function() {
    
    it('should render content for truthy values', function() {
      var template = 'foobar{?value}success{/}'
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: true}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: 1}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: {}}))
    })

    it('should not render content for falsy values', function() {
      var template = 'foobar{?value}failure{/}'
      assert.equal('foobar', TinyTemplate.render(template, {value: false}))
      assert.equal('foobar', TinyTemplate.render(template, {value: 0}))
      assert.equal('foobar', TinyTemplate.render(template, {value: null}))
      assert.equal('foobar', TinyTemplate.render(template, {value: undefined}))
      assert.equal('foobar', TinyTemplate.render(template, {value: " "}))
      assert.equal('foobar', TinyTemplate.render(template, {value: ""}))
      assert.equal('foobar', TinyTemplate.render(template, {value: []}))
      assert.equal('foobar', TinyTemplate.render(template, {}))
    })

  })

  describe('! (render if falsy) modifier', function() {
    
    it('should render not content for truthy values', function() {
      var template = 'foobar{!value}failure{/}'
      assert.equal('foobar', TinyTemplate.render(template, {value: true}))
      assert.equal('foobar', TinyTemplate.render(template, {value: 1}))
      assert.equal('foobar', TinyTemplate.render(template, {value: {}}))
    })

    it('should render content for truthy values', function() {
      var template = 'foobar{!value}success{/}'
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: false}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: 0}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: null}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: undefined}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: " "}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: ""}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {value: []}))
      assert.equal('foobarsuccess', TinyTemplate.render(template, {}))
    })

  })

  describe('& (skip escape) modifier', function() {

    it('should not escape bad characters in value', function() {
      var template = 'foobar{&value}'
      assert.equal('foobar<', TinyTemplate.render(template, {value: '<'}))
      assert.equal('foobar>', TinyTemplate.render(template, {value: '>'}))
      assert.equal('foobar\'', TinyTemplate.render(template, {value: '\''}))
      assert.equal('foobar"', TinyTemplate.render(template, {value: '"'}))
      assert.equal('foobar&', TinyTemplate.render(template, {value: '&'}))
    })

  })


})