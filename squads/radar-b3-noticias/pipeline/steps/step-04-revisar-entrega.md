---
execution: inline
agent: revisor-mercado
inputFile: squads/radar-b3-noticias/output/analise-b3.md
outputFile: squads/radar-b3-noticias/output/relatorio-final-b3.md
on_reject: step-03-analisar-movimentos
---

# Step 04: Revisar entrega

## Context Loading

Load estes arquivos:
- `squads/radar-b3-noticias/output/analise-b3.md` — análise candidata
- `squads/radar-b3-noticias/pipeline/data/quality-criteria.md` — critérios finais
- `squads/radar-b3-noticias/pipeline/data/anti-patterns.md` — erros a evitar

## Instructions

### Process
1. Verificar completude de estrutura.
2. Validar consistência entre números, narrativa e riscos.
3. Ajustar clareza final para leitura operacional.
4. Aprovar ou rejeitar com feedback objetivo.

## Output Format

O output deve seguir esta estrutura:
```markdown
# Relatório Final B3

## Status de Revisão
- aprovado | rejeitado

## Ajustes Aplicados
- ...

## Entrega Final
[conteúdo final pronto para uso]
```

## Output Example

Exemplo completo com status aprovado e entrega final revisada.

## Veto Conditions

Reject and redo if ANY are true:
1. Status de revisão não informado.
2. Entrega final sem seção de riscos e gatilhos.

## Quality Criteria

- [ ] Status de revisão explícito
- [ ] Ajustes documentados
- [ ] Entrega final clara e acionável
