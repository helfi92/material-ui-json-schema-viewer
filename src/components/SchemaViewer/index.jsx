import React, { useState, Fragment } from 'react';
import Header from '../Header';
import React, { useState } from 'react';
import { shape, string, arrayOf } from 'prop-types';
import SchemaTable from '../SchemaTable';
import SourceView from '../SourceView';
import { schema } from '../../utils/prop-types';
import { createSchemaTree } from '../../utils/schemaTree';

function SchemaViewer({ schema, references }) {
  /**
   * Create a tree structure based on the given schema.
   * This acts as an intermediary data structure to define the overall
   * structure the schemaTable component will create based upon.
   * the entire tree structure will be updated to re-create and re-render
   * the schema table when a $ref is expanded or shrunk.
   */
  const [schemaTree, setSchemaTree] = useState(createSchemaTree(schema));
  /**
   * Track the mode of the schema viewer.
   * By default, the mode is set to a table mode to display a schemaTable.
   * If the mode is set to a source mode, displays the schema source instead.
   */
  const [sourceMode, setSourceMode] = useState(false);
  /** 
   * Create a reference map where all the references schemas are stored
   * in ($id, schema) key-value format. This will be used as a database
   * to which the schema viewer can refer to when expanding a $ref.
   */
  const refMap = references.reduce((acc, schema) => {
    return { ...acc, [schema.$id]: schema };
  }, {});

  function handleViewToggle() {
    setSourceMode(prev => !prev);
  }

  return (
    <Fragment>
      <Header
        schema={schema}
        sourceMode={sourceMode}
        toggleMode={handleViewToggle}
      />
      {sourceMode ? (
        <SourceView schema={schema} />
      ) : (
        <SchemaTable schemaTree={schemaTree} setSchemaTree={setSchemaTree} references={refMap}/>
      )}
    </Fragment>
  );
}

SchemaViewer.propTypes = {
  /** Schema input given to render */
  schema,
  references: arrayOf(schema),
};

SchemaViewer.defaultProps = {
  /** Null type schema is set as default prop */
  schema: {
    type: 'null',
  },
  references: [
    {
      type: 'null',
    },
  ],
};

export default React.memo(SchemaViewer);
