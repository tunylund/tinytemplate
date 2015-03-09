describe('rendering', function() {

  it('should build an array from template', function() {
    assert.deepEqual(TinyTemplate.build('<div>{foo}</div>'), ['<div>', 'foo', '</div>'])
  })

  it('should not rebuild already built template', function() {
    var template = 'template'
    assert.equal(template, TinyTemplate.build(template))
    assert.equal(template, TinyTemplate.getBuiltTemplates()[template])
    TinyTemplate.getBuiltTemplates()[template] = true
    assert.equal(true, TinyTemplate.build(template))
    assert.equal(true, TinyTemplate.getBuiltTemplates()[template])
  })

})