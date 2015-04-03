/*
 * grunt-stitch
 * 
 *
 * Copyright (c) 2015 spike yang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    // find file name from a path
    var get_tailing_name = function(name){
        return name.replace(/^.*[\\\/]/, '');
    };

    // find tags from the file
    var find_tags = function(content){
        var TAG_EXPRESSION = /{{\s*include\s+.*}}/gi;
        return content.match(TAG_EXPRESSION);
    };

    // replace tag with file content
    var replace_tag =  function(content, tag, srcList){
        var filename = tag.replace(/[\'\"]/g,'').match(/[^\s]+.stitch/);
        //grunt.log.writeln(filename);

        if(!filename){
            //wrong file name
            grunt.log.writeln('filename not found!');
            return content;
        }
        else{
            // replace the tag with filename[0]
            //find the file name in srcList
            var filePath = srcList.filter(
                function(path){
                    if(filename[0] === get_tailing_name(path)){
                        return true;
                    }
                    else{
                        return false;
                    }
                });

            if(!filePath){
                return content;
            }
            else{
                return content.replace(tag,grunt.file.read(filePath[0]));
            }
        }
    };

    grunt.registerMultiTask('stitch', 'Simplest html template engine.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: '\n'
        });

        
        this.files.forEach(function(file){
            var destPath = file.dest;
            var srcList = file.src;
            var counter = 0;

            file.src.filter(
                function(file1){
                    if(!grunt.file.exists(file1)){
                        grunt.log.warn('Sourcefile "' + file1 + '" not exist');
                        return false;
                    }
                    return true;
                    
                }
            ).map(
                function(filepath){
                    //grunt.log.writeln(filepath);
                    //grunt.log.writeln(fileContent);

                    var fileName = filepath.replace(/^.*[\\\/]/, '');
                    if( fileName[0] === '_'){
                        grunt.log.writeln('Pass ... ' + fileName);
                    }
                    else{// do template replace work
                        counter++;
                        grunt.log.writeln('Handle ... ' + fileName);

                        var fileContent = grunt.file.read(filepath);
                        var destName = destPath + fileName.replace(/.stitch/,'.html');
                        var tags = find_tags(fileContent);
                        //grunt.log.writeln('---------------------');
                        //grunt.log.writeln(fileContent);
                        //grunt.log.writeln(tags);
                        //grunt.log.writeln('---------before------------');

                        //fileContent = replace_tag(fileContent,tags[0],srcList);
                        //fileContent = replace_tag(fileContent,tags[1],srcList);

                        while(tags){
                           for(var i=0;i< tags.length;i++){
                               //grunt.log.writeln(tags[i]);
                               fileContent = replace_tag(fileContent,tags[i], srcList);
                           }
                           
                            tags = find_tags(fileContent);
                        }
                        //grunt.log.writeln(srcList);
                        //grunt.log.writeln('--------after-------------');
                        //grunt.log.writeln(fileContent);
                        //grunt.log.writeln(destName);
                        //grunt.log.writeln('---------------------');

                        grunt.file.write(destName,fileContent);
                        
                    }
                }
            );
            grunt.log.writeln('Destination directory is: '+ destPath);
        });
    });
};
