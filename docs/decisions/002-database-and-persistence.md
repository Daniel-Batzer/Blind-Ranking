# ADR-002: Database and Persistence

## Status

Accepted

## Context

Blind Ranking stores strongly related data such as users, topics, game
sessions, participants and rankings.

The application also requires data integrity rules such as preventing a
participant from assigning the same rank multiple times within a game.

Future analytics will require relational queries and aggregations across game
data.

The application is structured as a modular monolith with explicit domain
boundaries. The persistence model should reflect these boundaries without
introducing separate databases or services prematurely.

## Decision

PostgreSQL will be used as the primary relational database.

Prisma will be used as the primary ORM and migration tool while database
concepts such as constraints, indexes, transactions and query performance
remain explicit architectural concerns.

PostgreSQL schemas will be used to organize tables by their domain
responsibility.

The initial schemas are:

### identity

Persistent platform identities and their external accounts.

- users
- external_accounts

### content

Content that can be used to construct Blind Ranking games.

- topics
- ranking_items
- suggestions

### game

State and results belonging to concrete game sessions.

- sessions
- session_items
- session_participants
- rankings

The `public` schema will not be used as a default location for application
tables.

New schemas should only be introduced when a new domain responsibility
justifies them.

## Domain Boundaries

A `User` represents a persistent identity on the platform.

A `SessionParticipant` represents participation in one specific game session
and therefore belongs to the `game` domain.

A participant may reference a registered user but does not require one,
allowing anonymous participation.

Suggestions belong to the `content` domain regardless of their source.

For example, Twitch Channel Points may create a suggestion, but Twitch is an
integration mechanism rather than the owner of the suggestion domain.

## Alternatives Considered

### Public schema only

All application tables could use PostgreSQL's default `public` schema.

Advantages:

- minimal configuration
- simple naming
- sufficient for small applications

Disadvantages:

- domain boundaries are not represented in the persistence structure
- organization becomes less clear as the application grows

### Highly specialized schemas

Separate schemas could be introduced for concerns such as authentication,
Twitch, moderation and analytics.

Advantages:

- highly explicit separation

Disadvantages:

- unnecessary complexity for the current domain
- risk of organizing persistence around technologies rather than business
  responsibilities
- premature abstraction

## Consequences

Positive:

- persistence structure reflects application domain boundaries
- related tables remain easy to discover
- PostgreSQL constraints and relational features remain available across
  domains
- no additional database infrastructure is required
- future tables require an explicit domain ownership decision

Negative:

- schema-qualified table names introduce some additional complexity
- Prisma configuration and migrations must support multiple PostgreSQL schemas
- domain ownership must remain consistent as the application evolves

## Future Considerations

Additional schemas should be introduced only when a sufficiently independent
domain emerges.

External integrations such as Twitch should not automatically receive their
own database schema. Persistent integration-specific state may justify one
later if its scope grows significantly.
