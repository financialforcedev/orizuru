/*
 * Copyright (c) 2017-2019, FinancialForce.com, inc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 * - Neither the name of the FinancialForce.com, inc nor the names of its contributors
 *      may be used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @module validator/shared/schema
 */

import { Type } from 'avsc';
import { hasIn, isPlainObject, isString } from 'lodash';

import { AvroSchema } from '../../..';

/**
 * Parses the schema from a JSON string.
 */
function parseSchema(schema: string) {

	try {
		return JSON.parse(schema);
	} catch (error) {
		throw new Error(`Invalid Avro Schema. Failed to parse JSON string: ${schema}.`);
	}

}

/**
 * Compiles the schema using the {@link https://www.npmjs.com/package/avsc|NPM avsc library}.
 *
 * This also checks that the schema has no anonymous types which can cause problems with other
 * [Apache Avro](https://avro.apache.org/docs/current/) implementations.
 */
function compileSchema(uncompiledSchema: any) {

	try {
		return Type.forSchema(uncompiledSchema, {
			noAnonymousTypes: true
		});
	} catch (error) {
		throw new Error(`Invalid Avro Schema. Schema error: ${error.message}.`);
	}

}

/**
 * Validates the [Apache Avro](https://avro.apache.org/docs/current/) schema.
 */
export class SchemaValidator {

	/**
	 * Validates the schema.
	 * @param schema The [Apache Avro](https://avro.apache.org/docs/current/) schema to validate.
	 */
	public validate(schema: any): AvroSchema {

		if (!schema) {
			throw new Error('Missing required avro-schema parameter: schema.');
		}

		if (isString(schema)) {
			const parsedSchema = parseSchema(schema);
			schema = compileSchema(parsedSchema);
		} else if (isPlainObject(schema)) {
			schema = compileSchema(schema);
		} else if (hasIn(schema, 'toJSON') && hasIn(schema, 'toBuffer')) {
			// Compile the schema to validate that there are no anonymous types.
			schema = compileSchema(schema);
		} else {
			throw new Error(`Invalid Avro Schema. Unexpected value type: ${typeof schema}.`);
		}

		return schema;

	}

}
