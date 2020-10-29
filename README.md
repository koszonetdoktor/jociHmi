## Hogy adj hozzá új Svelte komponenst

1. Csinaj új Svelte projektet
2. Add hozzá a következőt a VS projekt `hmiextproj` fajljához az `ItemGroup` szekcióban

```html
<content Include="JociAdvancedComponentControlControl\componentSrc.js">
    <SubType>Content</SubType>
</content>
```

3. Add hozzá a következőt a `Description.json` `dependencyFiles` propertyhez:

```json
{
    "name": "componentSrc.js",
    "type": "JavaScript",
    "description": "custom componnt build from Svelte"
}
```

4. Mostmár megcsinálhatod a komponenst a FrameworkControl main TypeScript fájlban. Pl:

```javascript
// @ts-ignore
new window.OldDoorComponent({
    target: buttonContainer,
    props: {
        eventName: `${this.__id}_angleChange`,
    },
})
```

5. A nuget pacakge buildelése előtt a `Ajto.nuspec` fájlbana verzió számot növelni kell, semantic versioning alapjan

```
...
<version>1.0.3</version>
...
```
