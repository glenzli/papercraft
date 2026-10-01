# 模型与涂装组织 / Models and liveries

模型库按名称、描述、类别和难度搜索筛选。基础版与精细版使用不同模型 ID；显示名称可调整，已分发模型包与涂装的 ID 保持稳定。筛选只影响列表，点击卡片才切换模型。导入同一 ID 的模型包更新已有条目。

The library searches names and descriptions and filters by category and difficulty. Basic and detailed variants have distinct model IDs. Display names may change without changing package or livery IDs. Filtering only changes the list; selecting a card changes the model. Importing the same model ID updates its existing entry.

涂装面板分为预设、调色与文字、贴图。预设列表只显示当前模型绑定的涂装；多于四项时提供搜索。借用其他车型配色的条目称为“风格”，不会更改几何外形。选择预设会替换自定义颜色和上传贴图，保留文字与编组数量。

Liveries have separate preset, color/text and artwork tabs. Presets are bound to the selected model; lists longer than four entries support search. Styles inspired by another vehicle change artwork only. Selecting a preset replaces custom colors and uploaded artwork while retaining custom text and consist count.

每款模型的编组、当前涂装、颜色、文字和已应用贴图在当前页面会话内分别保留。刷新页面会清除这些编辑状态；此功能不等同于持久保存项目。

Each model retains its consist count, livery, colors, text and applied artwork within the current page session. Reloading clears these drafts; this is not persistent project storage.

## 新模型接入 / Adding models

- 在模型清单中提供中英文名称、描述、类别和难度。筛选类别从清单生成，未知类别仍会显示原始名称；可在 `catalog.ts` 添加显示译名。Supply names, descriptions, category and difficulty. Category filters are generated from the manifest; unknown categories remain visible and can receive translated labels in `catalog.ts`.
- 按模型 ID 绑定预设。没有涂装的导入模型从素色开始。Bind presets by model ID. Imported models without liveries start with plain colors.
- 独立涂装文件的非空 `targetConsistIds` 优先于类别；只有未绑定具体模型时才按类别或 `all` 匹配。重复导入同 ID 涂装替换原条目。An explicit non-empty `targetConsistIds` list takes precedence over category matching. Category or `all` applies only without explicit bindings. Importing the same livery ID replaces its previous entry.
- 模型几何仍需遵守[展开约束](geometry-pipeline.md)，并通过 `npm test`。搜索列表可扩展不代表任意模型都已具备专属涂装绘制器。Geometry must satisfy the [pipeline contracts](geometry-pipeline.md) and `npm test`. An extensible library does not imply that every future model already has a dedicated artwork renderer.
- `aircraft` 分类用于飞机；道路车型使用 `vehicle`。独立几何和涂装放在运输模型模块。`assemblySteps: [{ text, textEn }]` 可提供双语专属步骤，指南和 PDF 使用同一数据，资源包保留它。Use `aircraft` for planes and `vehicle` for road vehicles. Keep their geometry and artwork in transport modules. Optional bilingual `assemblySteps` drive the guide and appended PDF sheet and survive package exchange.
