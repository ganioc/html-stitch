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
        var TAG_EXPRESSION = /{{\s*(?:include|inherit)\s+.*}}/gi;
        var tags =  content.match(TAG_EXPRESSION);

        if(!tags){
            return null;
        }
        else{
            tags = tags.map(function(tag){
                       return tag.replace(/[\'\"]/g,'');
                   });
            return tags;
        }
    };
    var get_file_exist = function(tag, srcList){
        var filename = tag.match(/[^\s]+stitch/);
        //grunt.log.writeln(filename);
        if(!filename){
            grunt.log.writeln('Wrong file: '+ tag + ' not found!');
            return null;
        }

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
            grunt.log.writeln('File: '+ tag + ' not found!');
            return null;
        }else{
            return filePath[0];
        }
    };
    // replace tag with file content
    var replace_tag =  function(content, tag, srcList){
        var filePath = get_file_exist(tag,srcList);
        if(!filePath){
            return content;
        }
        else{
            return content.replace(tag,grunt.file.read(filePath));
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
                        return;
                    }
                    // do template replace work
                    counter++;
                    grunt.log.writeln(counter + '=============');
                    grunt.log.writeln('Handle ... ' + fileName);

                    var fileContent = grunt.file.read(filepath);
                    var destName = destPath + fileName.replace(/.stitch/,'.html');

                    
                    var tags = find_tags(fileContent);

                     
                    
                    grunt.log.writeln('---------------------');
                    grunt.log.writeln(tags);
                    grunt.log.writeln('---------------------');
                    
                    //grunt.log.writeln('---------before------------');

                    //fileContent = replace_tag(fileContent,tags[0],srcList);
                    //fileContent = replace_tag(fileContent,tags[1],srcList);
                    
                    // if tags [] contain inherit
                    
                    var tag_inherit= null;
                    tags= tags.filter(
                        function(tag){
                            var inherit = tag.match(/{{\s*inherit/);
                            if(inherit){
                                tag_inherit = tag;
                                grunt.log.writeln(tag);
                                return false;
                            }else{
                                return true;
                            }
                        });
                    
                    
                    // 1. fileContent is inherit-> file content
                    if(tag_inherit){
                        grunt.log.writeln('into tag_inherit');
                        grunt.log.writeln('tag inherit is:' + tag_inherit);
                        grunt.log.writeln('tags are:');
                        grunt.log.writeln(tags);
                        // if filename not exist
                        var fileInherit = get_file_exist(tag_inherit, srcList);
                        
                        if(fileInherit){
                            grunt.log.writeln(fileInherit);

                            fileContent = grunt.file.read(fileInherit);
                            //
                            // 2. replace every tags, include oldtag:newtag
                            if(tags){
                                
                                tags.map(
                                    function(tag){
                                        var oldTag=tag.match(/[^\s]+stitch:/);
                                        var newTag=tag.match(/:.*stitch/);
                                        //grunt.log.writeln(oldTag);
                                        //grunt.log.writeln(newTag);
                                        //grunt.log.writeln('above is old new tag');
                                        if(oldTag && newTag){
                                            oldTag = oldTag[0].replace(':','');
                                            newTag = newTag[0].replace(':','');
                                            grunt.log.writeln(oldTag);
                                            grunt.log.writeln(newTag);
                                            grunt.log.writeln('above is old new tag');

                                            var oldRe = new RegExp( '{{\\s*include\\s+' + oldTag + '\\s*}}','gi');
                                            fileContent= fileContent.replace(oldRe,'{{ include '+ newTag + ' }}');

                                        }
                                    }
                                );
                            }
                        }
                    }

                    // 3. tags = find_tags()
                    tags = find_tags(fileContent);
                    grunt.log.writeln('into last stage');
                    grunt.log.writeln(fileContent);
                    grunt.log.writeln(tags);
                    grunt.log.writeln('------------------');

                    while(tags){
                        for(var i=0;i< tags.length;i++){
                            grunt.log.writeln(tags[i]);
                            fileContent = replace_tag(fileContent,tags[i], srcList);
                        }
                        
                        tags = find_tags(fileContent);
                        grunt.log.writeln(tags);
                    }
                    //grunt.log.writeln(srcList);
                    grunt.log.writeln('--------after-------------');
                    grunt.log.writeln(fileContent);
                    grunt.log.writeln(destName);
                    //grunt.log.writeln('---------------------');

                    grunt.file.write(destName,fileContent);
                        
                }
            );
            grunt.log.writeln('Destination directory is: '+ destPath);
        });
    });
};
