## How to add new Svelte component
1. Create the Svelte project
2. Add the following to the project's `hmiextproj` file in the `ItemGroup` section
```html
<Content Include="JociAdvancedComponentControlControl\componentSrc.js">
    <SubType>Content</SubType>
</Content>
```
3. Add the following in the `Description.json` `dependencyFiles` property: 
```json
{
    "name": "componentSrc.js",
    "type": "JavaScript",
    "description": "custom componnt build from Svelte"
}
```
4. Now the component can be created in the main ts file of the control. For example: 
```javascript
// @ts-ignore
new window.OldDoorComponent({
    target: buttonContainer,
    props: {
        eventName: `${this.__id}_angleChange`
    }
})
```