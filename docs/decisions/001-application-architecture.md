# ADR-001: Application Architecture

## Status

Accepted

## Context

Blind Ranking is a realtime multiplayer web application for streamers and
their communities.

The initial version is expected to run on a single virtual server together
with other applications. Infrastructure cost should remain low and the
initial expected load is relatively small.

The application contains two different types of workloads:

- traditional web application functionality such as creator dashboards,
  topic management and administration
- realtime game functionality such as participant connections, ranking
  submissions, progress updates and result reveals

A future version may require independent scaling of the realtime layer.

## Decision

The application will initially be implemented as a modular monolith.

The web application, application services and realtime functionality will be
deployed together during the initial development phase.

Internal boundaries will be maintained between:

- presentation and transport
- application services
- domain logic
- persistence and external integrations

Realtime transport code must not contain core game logic.

Business logic should instead be implemented in reusable application or
domain services.

Example:

Socket event
→ application service
→ domain logic
→ repository
→ database

This structure should allow parts of the application, especially the
realtime layer, to be extracted into independently deployable services if
future scaling requirements justify the additional complexity.

## Alternatives Considered

### Separate web and realtime applications

The web application and realtime server could be deployed independently from
the beginning.

Advantages:

- independent deployment
- independent scaling
- explicit service boundaries

Disadvantages:

- increased infrastructure complexity
- additional communication and failure modes
- more complex local development and testing
- unnecessary overhead for the expected initial load

### Single tightly coupled application

All functionality could be implemented directly inside the Next.js
application without explicit module boundaries.

Advantages:

- simplest initial implementation
- minimal infrastructure

Disadvantages:

- high risk of coupling transport, business logic and persistence
- difficult extraction of realtime functionality later
- reduced testability

## Consequences

Positive:

- low initial infrastructure complexity
- low hosting requirements
- fast local development
- business logic can be tested independently of transport
- future extraction of realtime functionality remains possible

Negative:

- web and realtime workloads initially share the same deployment lifecycle
- scaling cannot initially be performed independently
- architectural boundaries must be enforced through code structure rather
  than physical service separation

## Future Considerations

If realtime traffic grows significantly, the realtime layer may be extracted
into a separate service.

Multiple realtime instances may later require shared coordination such as
Redis Pub/Sub.

Container orchestration such as Kubernetes should only be introduced when
there is a concrete operational or scaling requirement.
