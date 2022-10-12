<?php

use App\Models\Problem;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\Problem\ProblemRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProblemTest extends TestCase
{
    protected $problem;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        $renter = User::factory()->create(['role' => 1]);
        $responder = User::factory()->create(['role' => 0]);
        // Prepare data for test
        $this->problem = [
            'renter_id' => $renter->id,
            'title' => $this->faker->unique()->numerify('Problem ###'),
            'description' => $this->faker->paragraph(),
            'severity_level' => 1,
            'status' => 2,
            'replied_by' => $responder->id,
            'reply_text' => 'OK',
        ];
        $this->problem_repository = new ProblemRepository();
    }

    public function test_all() {
        $all_problems = $this->problem_repository->all();
        $this->assertDatabaseCount('problems', count($all_problems));
    }

    public function test_store() {
        $test_problem = array();
        $test_problem = $this->problem;
        //Problem is not replied
        $test_problem['status'] = 1;
        $test_problem['replied_by'] = null;
        $test_problem['reply_text'] = null;
        $problem = $this->problem_repository->store($test_problem, $this->problem['renter_id']);
        $this->assertInstanceOf(Problem::class, $problem);
        $this->assertDatabaseHas('problems', $test_problem);
    }

    public function test_show() {
        $problem = Problem::factory()->create(['renter_id' => $this->problem['renter_id']]);
        $found_problem = $this->problem_repository->show($problem->id);
        $this->assertInstanceOf(Problem::class, $found_problem);
        $this->assertEquals($found_problem->renter_id, $problem->renter_id);
        $this->assertEquals($found_problem->title, $problem->title);
        $this->assertEquals($found_problem->status, $problem->status);
        $this->assertEquals($found_problem->description, $problem->description);
        $this->assertEquals($found_problem->severity_level, $problem->severity_level);
    }

    public function test_update() {
        $problem = Problem::factory()->create([
            'renter_id' => $this->problem['renter_id'],
            'status' => 2,
            'replied_by' => $this->problem['replied_by'],
            'reply_text' => $this->problem['reply_text']]);
        $new_problem = $this->problem_repository->update($this->problem, $problem->id);
        $this->assertInstanceOf(Problem::class, $new_problem);
        $this->assertEquals($new_problem->title, $this->problem['title']);
        $this->assertEquals($new_problem->description, $this->problem['description']);
        $this->assertEquals($new_problem->severity_level, $this->problem['severity_level']);
        $this->assertDatabaseHas('problems', $this->problem);
    }

    public function test_delete() {
        $problem = Problem::factory()->create(['renter_id' => $this->problem['renter_id']]);
        $delete_problem = $this->problem_repository->delete($problem->id);
        $this->assertTrue($delete_problem);
        $this->assertDatabaseMissing('problems', $problem->toArray());
    }

    public function test_update_status() {
        $problem = Problem::factory()->create([
            'renter_id' => $this->problem['renter_id'],
            'title' => $this->problem['title'],
            'description' => $this->problem['description'],
            'severity_level' => $this->problem['severity_level'],
            'replied_by' => $this->problem['replied_by'],
            'reply_text' => $this->problem['reply_text']]);
        $new_problem = $this->problem_repository->updateStatus($this->problem, $problem->id);
        $this->assertInstanceOf(Problem::class, $new_problem);
        $this->assertEquals($new_problem->status, $this->problem['status']);
        $this->assertDatabaseHas('problems', $this->problem);
    }

    public function test_reply_problem() {
        $problem = Problem::factory()->create([
            'renter_id' => $this->problem['renter_id'],
            'title' => $this->problem['title'],
            'description' => $this->problem['description'],
            'severity_level' => $this->problem['severity_level']]);
        $new_problem = $this->problem_repository->reply($this->problem, $problem->id, $this->problem['replied_by']);
        $this->assertInstanceOf(Problem::class, $new_problem);
        $this->assertEquals($new_problem->replied_by, $this->problem['replied_by']);
        $this->assertEquals($new_problem->reply_text, $this->problem['reply_text']);
        $this->assertEquals($new_problem->status, 2); //Status On-going
        $this->assertDatabaseHas('problems', $this->problem);
    }
}
