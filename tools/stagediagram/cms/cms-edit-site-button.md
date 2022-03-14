# StageDiagram

## The new stage Diagram version

```mermaid
stateDiagram-v2
    [*] --> EditSiteButtonClick
    EditSiteButtonClick --> GetHomePageID
    GetHomePageID --> CheckHaveHomePageID
    CheckHaveHomePageID --> HaveHomePageID
    CheckHaveHomePageID --> NotHaveHomePageID
    HaveHomePageID --> GotoRouteCMSEditWithHomePageId
    NotHaveHomePageID --> showErorNotFoundAnyHomePage
```
