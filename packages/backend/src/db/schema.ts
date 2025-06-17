import { pgTable, serial, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const fsNodes = pgTable('fs_nodes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 10 }).notNull(),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fsNodesRelations = relations(fsNodes, ({ one, many }) => ({
    parent: one(fsNodes, { fields: [fsNodes.parentId], references: [fsNodes.id], relationName: 'parent' }),
    children: many(fsNodes, { relationName: 'parent' }),
}));